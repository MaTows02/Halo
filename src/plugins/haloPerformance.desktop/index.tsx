/*
 * Halo, a Discord client mod
 * Copyright (c) 2026 Halo contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { definePluginSettings } from "@api/Settings";
import { managedStyleRootNode } from "@api/Styles";
import { getUserSetting } from "@api/UserSettings";
import { Button } from "@components/Button";
import { Heading } from "@components/Heading";
import { Paragraph } from "@components/Paragraph";
import { openPluginModal } from "@components/settings/tabs/plugins/PluginModal";
import { Devs } from "@utils/constants";
import { classNameFactory, createAndAppendStyle } from "@utils/css";
import { t, useHaloLanguage } from "@utils/i18n";
import { Margins } from "@utils/margins";
import definePlugin, { OptionType, PluginNative } from "@utils/types";
import { React, showToast, useEffect, useState } from "@webpack/common";

import type { GpuUsage, ProcessMetric } from "./native";

const Native = PrismeNative.pluginHelpers.HaloPerformance as PluginNative<typeof import("./native")>;
const cl = classNameFactory("vc-halo-perf-");

interface PerfOptions {
    reduireAnimations: boolean;
    masquerDecorations: boolean;
    pauseMedias: boolean;
    ralentirArrierePlan: boolean;
    prioriteBasse: boolean;
    libererApresMinutes: number;
}

const PROFILS: Record<string, PerfOptions | null> = {
    origine: { reduireAnimations: false, masquerDecorations: false, pauseMedias: false, ralentirArrierePlan: false, prioriteBasse: false, libererApresMinutes: 0 },
    equilibre: { reduireAnimations: false, masquerDecorations: false, pauseMedias: true, ralentirArrierePlan: false, prioriteBasse: false, libererApresMinutes: 15 },
    economie: { reduireAnimations: true, masquerDecorations: true, pauseMedias: true, ralentirArrierePlan: true, prioriteBasse: true, libererApresMinutes: 5 },
    perso: null
};

const isCustomHidden = () => settings.store.profil !== "perso";

const settings = definePluginSettings({
    profil: {
        type: OptionType.SELECT,
        get displayName() { return t("perf.profile"); },
        description: "",
        options: [
            { get label() { return t("perf.profile.origine"); }, value: "origine", default: true },
            { get label() { return t("perf.profile.equilibre"); }, value: "equilibre" },
            { get label() { return t("perf.profile.economie"); }, value: "economie" },
            { get label() { return t("perf.profile.perso"); }, value: "perso" }
        ],
        onChange: () => applyOptions()
    },
    moniteur: {
        type: OptionType.BOOLEAN,
        get displayName() { return t("perf.monitor"); },
        description: "",
        default: false,
        onChange: () => applyOptions()
    },
    seuilAlerte: {
        type: OptionType.NUMBER,
        get displayName() { return t("perf.alert"); },
        description: "",
        default: 1500
    },
    reduireAnimations: {
        type: OptionType.BOOLEAN,
        get displayName() { return t("perf.opt.animations"); },
        description: "",
        default: false,
        hidden: isCustomHidden,
        onChange: () => applyOptions()
    },
    masquerDecorations: {
        type: OptionType.BOOLEAN,
        get displayName() { return t("perf.opt.decorations"); },
        description: "",
        default: false,
        hidden: isCustomHidden,
        onChange: () => applyOptions()
    },
    pauseMedias: {
        type: OptionType.BOOLEAN,
        get displayName() { return t("perf.opt.media"); },
        description: "",
        default: false,
        hidden: isCustomHidden
    },
    ralentirArrierePlan: {
        type: OptionType.BOOLEAN,
        get displayName() { return t("perf.opt.throttle"); },
        description: "",
        default: false,
        hidden: isCustomHidden,
        onChange: () => applyOptions()
    },
    prioriteBasse: {
        type: OptionType.BOOLEAN,
        get displayName() { return t("perf.opt.priority"); },
        description: "",
        default: false,
        hidden: isCustomHidden,
        onChange: () => applyOptions()
    },
    libererApresMinutes: {
        type: OptionType.NUMBER,
        get displayName() { return t("perf.opt.trim"); },
        description: "",
        default: 0,
        hidden: isCustomHidden
    },
    panneau: {
        type: OptionType.COMPONENT,
        component: () => <PerformancePanel />
    },
    limiterCache: {
        type: OptionType.BOOLEAN,
        get displayName() { return t("perf.engine.cache"); },
        get description() { return t("perf.engine.restart"); },
        default: false,
        restartNeeded: true
    },
    moteurEconome: {
        type: OptionType.BOOLEAN,
        get displayName() { return t("perf.engine.js"); },
        get description() { return t("perf.engine.restart"); },
        default: false,
        restartNeeded: true
    },
    modeModeste: {
        type: OptionType.BOOLEAN,
        get displayName() { return t("perf.engine.lowEnd"); },
        get description() { return t("perf.engine.lowEndDesc"); },
        default: false,
        restartNeeded: true
    }
});

function currentOptions(): PerfOptions {
    const { store } = settings;
    return PROFILS[store.profil] ?? {
        reduireAnimations: store.reduireAnimations,
        masquerDecorations: store.masquerDecorations,
        pauseMedias: store.pauseMedias,
        ralentirArrierePlan: store.ralentirArrierePlan,
        prioriteBasse: store.prioriteBasse,
        libererApresMinutes: store.libererApresMinutes
    };
}

const CSS_OPTIONS: Partial<Record<keyof PerfOptions, string>> = {
    reduireAnimations: `*, *::before, *::after {
        animation-duration: 0s !important; animation-delay: 0s !important;
        transition-duration: 0s !important; transition-delay: 0s !important;
        scroll-behavior: auto !important;
    }`,
    masquerDecorations: '[class*="avatarDecoration"], [class*="profileEffects"], [class*="nameplate"] { display: none !important; }'
};

let style: HTMLStyleElement | null = null;
let monitor: HTMLDivElement | null = null;
let monitorTimer: ReturnType<typeof setInterval> | undefined;
let hiddenTimer: ReturnType<typeof setTimeout> | undefined;
let alerted = false;
const pausedMedia = new Set<HTMLVideoElement>();

// 1. Discord vide les caches du moteur de rendu ; 2. Windows retire de la RAM les pages inutilisées
export async function purgeMemory() {
    DiscordNative?.processUtils?.purgeMemory?.();
    await Native.trimWorkingSets();
}

async function refreshMonitor() {
    if (!monitor || document.hidden) return;
    const m = await Native.getMetrics();
    monitor.textContent = `RAM ${m.totalMemMB} ${t("unit.mb")} · CPU ${m.totalCpu.toFixed(1)} %`;

    const { seuilAlerte } = settings.store;
    const over = seuilAlerte > 0 && m.totalMemMB > seuilAlerte;
    monitor.classList.toggle(cl("monitor-alert"), over);
    if (over && !alerted) showToast({ text: t("perf.monitor.alert", { mb: m.totalMemMB, unit: t("unit.mb") }) });
    alerted = over;
}

function setMonitor(enabled: boolean) {
    if (enabled && !monitor) {
        monitor = document.createElement("div");
        monitor.className = cl("monitor");
        monitor.title = t("perf.monitor.title");
        monitor.onclick = () => openPluginModal(Prisme.Plugins.plugins.HaloPerformance);
        document.body.append(monitor);
        refreshMonitor();
        monitorTimer = setInterval(refreshMonitor, 3000);
    } else if (!enabled && monitor) {
        clearInterval(monitorTimer);
        monitor.remove();
        monitor = null;
    }
}

function onVisibilityChange() {
    const o = currentOptions();
    if (document.hidden) {
        if (o.pauseMedias) {
            for (const video of document.querySelectorAll("video")) {
                if (!video.paused && video.muted) {
                    video.pause();
                    pausedMedia.add(video);
                }
            }
        }
        if (o.libererApresMinutes > 0) hiddenTimer = setTimeout(purgeMemory, o.libererApresMinutes * 60_000);
    } else {
        clearTimeout(hiddenTimer);
        for (const video of pausedMedia) if (video.isConnected) video.play().catch(() => { });
        pausedMedia.clear();
    }
}

function applyOptions() {
    if (!style) return;
    const o = currentOptions();
    style.textContent = Object.entries(CSS_OPTIONS)
        .filter(([key]) => o[key as keyof PerfOptions])
        .map(([, css]) => css)
        .join("\n");
    Native.setBackgroundThrottling(o.ralentirArrierePlan);
    Native.setLowPriorityWhenHidden(o.prioriteBasse);
    setMonitor(settings.store.moniteur);
}

// Réglages du compte Discord (synchronisés entre appareils) : lecture automatique des médias animés
async function applyDiscordSettings() {
    const targets: [string, any][] = [["gifAutoPlay", false], ["animateEmoji", false], ["animateStickers", 2]];
    let applied = 0;
    for (const [name, value] of targets) {
        try {
            const setting = getUserSetting("textAndImages", name);
            if (!setting) continue;
            await setting.updateSetting(value);
            applied++;
        } catch { }
    }
    showToast(applied
        ? { text: t("perf.discord.applied", { count: applied }), variant: "success" }
        : { text: t("perf.discord.failed"), variant: "critical" });
}

const processType = (type: string) => ["Browser", "Tab", "GPU", "Utility"].includes(type) ? t(`perf.type.${type}` as "perf.type.Browser") : type;

function PerformancePanel() {
    useHaloLanguage();
    const [metrics, setMetrics] = useState<Awaited<ReturnType<typeof Native.getMetrics>> | null>(null);
    const [gpu, setGpu] = useState<GpuUsage | null>(null);
    const [gpuLoading, setGpuLoading] = useState(false);
    const [purging, setPurging] = useState(false);

    function measureGpu() {
        setGpuLoading(true);
        Native.getGpuUsage().then(setGpu).catch(() => { }).finally(() => setGpuLoading(false));
    }

    useEffect(() => {
        const load = () => Native.getMetrics().then(setMetrics).catch(() => { });
        load();
        measureGpu();
        const id = setInterval(load, 2000);
        return () => clearInterval(id);
    }, []);

    const heapMB = (performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) : null;
    const mb = t("unit.mb");

    return (
        <div className={cl("panel")}>
            <Heading tag="h5">{t("perf.panel.live")}</Heading>
            <div className={cl("stats")}>
                <div className={cl("stat")}><b>{metrics ? `${metrics.totalMemMB} ${mb}` : "…"}</b><span>{t("perf.panel.ram")}</span></div>
                <div className={cl("stat")}><b>{metrics ? `${metrics.totalCpu.toFixed(1)} %` : "…"}</b><span>{t("perf.panel.cpu")}</span></div>
                <div className={cl("stat")}><b>{heapMB != null ? `${heapMB} ${mb}` : "—"}</b><span>{t("perf.panel.js")}</span></div>
            </div>
            <div className={cl("stats")}>
                <div className={cl("stat")}><b>{gpu ? `${gpu.dedicatedMB} ${mb}` : gpuLoading ? "…" : "—"}</b><span>{t("perf.gpu.vram")}</span></div>
                <div className={cl("stat")}><b>{gpu ? `${gpu.utilization} %` : gpuLoading ? "…" : "—"}</b><span>{t("perf.gpu.load")}</span></div>
                <div className={cl("stat")}>
                    <b>{metrics ? t(metrics.hardwareAcceleration ? "perf.gpu.accelOn" : "perf.gpu.accelOff") : "…"}</b>
                    <span>{t("perf.gpu.accel")}</span>
                </div>
            </div>

            <div className={cl("actions")}>
                <Button size="small" disabled={purging} onClick={async () => {
                    const before = metrics?.totalMemMB;
                    setPurging(true);
                    await purgeMemory().catch(() => { });
                    const after = await Native.getMetrics();
                    setMetrics(after);
                    setPurging(false);
                    showToast({ text: before ? t("perf.panel.freed", { before, after: after.totalMemMB, unit: mb }) : t("perf.panel.freedShort"), variant: "success" });
                }}>
                    {t("perf.panel.free")}
                </Button>
                <Button size="small" variant="secondary" onClick={async () => {
                    await Native.clearHttpCache();
                    showToast({ text: t("perf.panel.cacheCleared"), variant: "success" });
                }}>
                    {t("perf.panel.clearCache")}
                </Button>
                <Button size="small" variant="secondary" disabled={gpuLoading} onClick={measureGpu}>
                    {t("perf.gpu.measure")}
                </Button>
            </div>

            {metrics && (
                <table className={cl("table")}>
                    <thead>
                        <tr><th>{t("perf.panel.process")}</th><th>PID</th><th>RAM</th><th>{t("perf.panel.private")}</th><th>CPU</th></tr>
                    </thead>
                    <tbody>
                        {[...metrics.processes].sort((a, b) => b.memMB - a.memMB).map((p: ProcessMetric) => (
                            <tr key={p.pid}>
                                <td>{processType(p.type)}{p.name ? ` · ${p.name}` : ""}</td>
                                <td>{p.pid}</td>
                                <td>{p.memMB} {mb}</td>
                                <td>{p.privateMB} {mb}</td>
                                <td>{p.cpu} %</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className={cl("discord")}>
                <Paragraph style={{ color: "var(--text-muted)" }}>{t("perf.discord.desc")}</Paragraph>
                <Button size="small" variant="secondary" className={Margins.top8} onClick={applyDiscordSettings}>
                    {t("perf.discord.apply")}
                </Button>
            </div>

            <Heading tag="h5" className={Margins.top8}>{t("perf.engine.title")}</Heading>
        </div>
    );
}

export default definePlugin({
    name: "HaloPerformance",
    description: "Performance profiles, RAM/CPU/GPU monitor and memory cleanup to make Discord lighter",
    tags: ["Utility"],
    authors: [Devs.Halo],
    dependencies: ["UserSettingsAPI"],
    settings,

    start() {
        style = createAndAppendStyle("HaloPerformance", managedStyleRootNode);
        document.addEventListener("visibilitychange", onVisibilityChange);
        applyOptions();
    },

    stop() {
        document.removeEventListener("visibilitychange", onVisibilityChange);
        clearTimeout(hiddenTimer);
        setMonitor(false);
        style?.remove();
        style = null;
        Native.setBackgroundThrottling(false);
        Native.setLowPriorityWhenHidden(false);
    }
});
