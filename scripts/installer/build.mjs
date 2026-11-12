/*
 * Halo, a Discord client mod
 * Copyright (c) 2026 Halo contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// Compile dist/HaloInstaller.exe avec le compilateur C# livré avec Windows (aucun SDK à installer).
// Le build de Halo (pnpm buildStandalone) doit exister : ses fichiers sont embarqués dans l'exe.

import { execFileSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

if (process.platform !== "win32") {
    console.error("L'installateur graphique ne se compile que sous Windows.");
    process.exit(1);
}

const framework = join(process.env.WINDIR ?? "C:\\Windows", "Microsoft.NET", "Framework64", "v4.0.30319");
const csc = join(framework, "csc.exe");
const embedded = ["patcher.js", "preload.js", "renderer.js", "renderer.css"];

const missing = embedded.filter(f => !existsSync(join("dist", f)));
if (missing.length) {
    console.error(`Fichiers manquants dans dist/ : ${missing.join(", ")}. Lancez d'abord « pnpm buildStandalone ».`);
    process.exit(1);
}

execFileSync(csc, [
    "/nologo",
    "/target:winexe",
    "/optimize+",
    "/codepage:65001",
    "/out:dist\\HaloInstaller.exe",
    "/win32icon:installer\\halo.ico",
    `/reference:${join(framework, "WPF", "PresentationFramework.dll")}`,
    `/reference:${join(framework, "WPF", "PresentationCore.dll")}`,
    `/reference:${join(framework, "WPF", "WindowsBase.dll")}`,
    `/reference:${join(framework, "System.Xaml.dll")}`,
    ...embedded.map(f => `/resource:dist\\${f},${f}`),
    "installer\\HaloInstaller.cs"
], { stdio: "inherit" });

console.log("dist\\HaloInstaller.exe compilé");
