/*
 * Halo, a Discord client mod
 * Copyright (c) 2026 Halo contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { RendererSettings } from "@main/settings";
import { execFile } from "child_process";
import { app, BrowserWindow, IpcMainInvokeEvent } from "electron";
import { constants, setPriority } from "os";

export interface ProcessMetric {
    pid: number;
    type: string;
    name: string;
    cpu: number;
    memMB: number;
    privateMB: number;
}

export interface GpuUsage {
    dedicatedMB: number;
    sharedMB: number;
    utilization: number;
}

// Options du moteur Chromium : elles ne peuvent être appliquées qu'avant le démarrage de Discord
const startupSettings = RendererSettings.store.plugins?.HaloPerformance;
if (startupSettings?.enabled) {
    if (startupSettings.limiterCache) {
        app.commandLine.appendSwitch("disk-cache-size", String(150 * 1024 * 1024));
        app.commandLine.appendSwitch("media-cache-size", String(64 * 1024 * 1024));
    }
    if (startupSettings.moteurEconome) app.commandLine.appendSwitch("js-flags", "--optimize-for-size");
    if (startupSettings.modeModeste) app.commandLine.appendSwitch("enable-low-end-device-mode");
}

const discordPids = () => app.getAppMetrics().map(m => m.pid).filter(Number.isInteger);

function runPowerShell(script: string): Promise<string> {
    return new Promise(resolve => {
        // -EncodedCommand évite tout problème de guillemets dans la ligne de commande
        const encoded = Buffer.from(script, "utf16le").toString("base64");
        execFile(
            "powershell.exe",
            ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand", encoded],
            { windowsHide: true, timeout: 20_000 },
            (_err, stdout) => resolve(String(stdout ?? "").trim())
        );
    });
}

export function getMetrics() {
    const processes: ProcessMetric[] = app.getAppMetrics().map(m => ({
        pid: m.pid,
        type: m.type,
        name: m.name || m.serviceName || "",
        cpu: Math.round((m.cpu?.percentCPUUsage ?? 0) * 10) / 10,
        memMB: Math.round((m.memory?.workingSetSize ?? 0) / 1024),
        privateMB: Math.round((m.memory?.privateBytes ?? 0) / 1024)
    }));

    const gpu = processes.find(p => p.type === "GPU");

    return {
        processes,
        totalMemMB: processes.reduce((n, p) => n + p.memMB, 0),
        totalCpu: Math.round(processes.reduce((n, p) => n + p.cpu, 0) * 10) / 10,
        gpuProcessMemMB: gpu?.memMB ?? 0,
        hardwareAcceleration: String((app.getGPUFeatureStatus() as any).gpu_compositing ?? "").startsWith("enabled")
    };
}

// Mémoire vidéo et charge GPU des processus de Discord, lues dans les compteurs de performance de Windows
// (les mêmes que ceux du Gestionnaire des tâches). Mesure à la demande : elle lance PowerShell.
export async function getGpuUsage(): Promise<GpuUsage | null> {
    if (process.platform !== "win32") return null;

    const filter = `'^pid_(${discordPids().join("|")})_'`;
    const out = await runPowerShell(`
$ErrorActionPreference = 'SilentlyContinue'
$m = Get-CimInstance Win32_PerfFormattedData_GPUPerformanceCounters_GPUProcessMemory | Where-Object { $_.Name -match ${filter} }
$e = Get-CimInstance Win32_PerfFormattedData_GPUPerformanceCounters_GPUEngine | Where-Object { $_.Name -match ${filter} }
$u = ($e | Group-Object { ($_.Name -split 'engtype_')[1] } | ForEach-Object { ($_.Group | Measure-Object UtilizationPercentage -Sum).Sum } | Measure-Object -Maximum).Maximum
"$([long]($m | Measure-Object DedicatedUsage -Sum).Sum)|$([long]($m | Measure-Object SharedUsage -Sum).Sum)|$([int]$u)"
`);

    const [dedicated, shared, utilization] = out.split("|").map(Number);
    if (!Number.isFinite(dedicated)) return null;

    return {
        dedicatedMB: Math.round(dedicated / 1048576),
        sharedMB: Math.round(shared / 1048576),
        utilization: Math.min(100, utilization || 0)
    };
}

// Demande à Windows de retirer de la RAM physique les pages inutilisées de tous les processus de Discord
// (EmptyWorkingSet). Les pages encore utiles sont rechargées à la demande.
export async function trimWorkingSets() {
    if (process.platform !== "win32") return false;

    await runPowerShell(`
$t = Add-Type -Name Memory -Namespace Halo -PassThru -MemberDefinition '[DllImport("psapi.dll")] public static extern bool EmptyWorkingSet(System.IntPtr handle);'
foreach ($id in @(${discordPids().join(",")})) {
    try { [void]$t::EmptyWorkingSet([Diagnostics.Process]::GetProcessById($id).Handle) } catch {}
}
`);
    return true;
}

export function setBackgroundThrottling(e: IpcMainInvokeEvent, enabled: boolean) {
    e.sender.setBackgroundThrottling(enabled);
}

const lowPriorityWindows = new WeakSet<BrowserWindow>();
let lowPriorityEnabled = false;

function setRendererPriority(win: BrowserWindow, low: boolean) {
    try {
        setPriority(win.webContents.getOSProcessId(), low ? constants.priority.PRIORITY_BELOW_NORMAL : constants.priority.PRIORITY_NORMAL);
    } catch { }
}

// Baisse la priorité du processus de l'interface quand la fenêtre est réduite ou cachée
export function setLowPriorityWhenHidden(e: IpcMainInvokeEvent, enabled: boolean) {
    lowPriorityEnabled = enabled;
    const win = BrowserWindow.fromWebContents(e.sender);
    if (!win) return;

    if (!lowPriorityWindows.has(win)) {
        lowPriorityWindows.add(win);
        const lower = () => lowPriorityEnabled && setRendererPriority(win, true);
        const restore = () => setRendererPriority(win, false);
        win.on("minimize", lower);
        win.on("hide", lower);
        win.on("restore", restore);
        win.on("show", restore);
        win.on("focus", restore);
    }

    if (!enabled) setRendererPriority(win, false);
}

export async function clearHttpCache(e: IpcMainInvokeEvent) {
    await e.sender.session.clearCache();
    await e.sender.session.clearCodeCaches({});
}
