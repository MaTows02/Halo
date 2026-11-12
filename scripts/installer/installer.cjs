#!/usr/bin/env node
/*
 * Halo, a Discord client mod
 * Copyright (c) 2026 Halo contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// Installateur Halo pour Windows (console).
//   node scripts/installer/installer.cjs                → menu interactif
//   --install [--branch stable|ptb|canary|all] [--dev] [--yes]
//   --uninstall [--branch …] [--yes]
//   --status
// --dev : Discord charge directement le dossier dist/ du dépôt (pnpm build puis Ctrl+R).

"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const readline = require("readline");
const { execSync, spawn } = require("child_process");

const REPO_ROOT = path.join(__dirname, "..", "..");
const DIST_SOURCE = path.join(REPO_ROOT, "dist");
const APPDATA = process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming");
const LOCALAPPDATA = process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
const HALO_DIR = path.join(APPDATA, "Halo");
const HALO_DIST = path.join(HALO_DIR, "dist");
const MARKER = "HALO_STUB";
const DIST_FILES = ["patcher.js", "preload.js", "renderer.js", "renderer.css"];

const BRANCHES = {
    stable: { label: "Discord (Stable)", folder: "Discord", exe: "Discord.exe" },
    ptb: { label: "Discord PTB", folder: "DiscordPTB", exe: "DiscordPTB.exe" },
    canary: { label: "Discord Canary", folder: "DiscordCanary", exe: "DiscordCanary.exe" }
};

const c = {
    bold: s => `\x1b[1m${s}\x1b[0m`,
    green: s => `\x1b[32m${s}\x1b[0m`,
    red: s => `\x1b[31m${s}\x1b[0m`,
    yellow: s => `\x1b[33m${s}\x1b[0m`,
    blurple: s => `\x1b[38;2;88;101;242m${s}\x1b[0m`,
    dim: s => `\x1b[2m${s}\x1b[0m`
};

/* ------------------------------------------------------------ archive asar minimale */

// Format asar : [taille de l'en-tête (pickle)] [en-tête JSON (pickle)] [contenu des fichiers]
function createAsar(files) {
    const header = { files: {} };
    let offset = 0;
    const blobs = [];
    for (const [name, content] of Object.entries(files)) {
        const buf = Buffer.from(content, "utf8");
        header.files[name] = { size: buf.length, offset: String(offset) };
        offset += buf.length;
        blobs.push(buf);
    }
    const json = Buffer.from(JSON.stringify(header), "utf8");
    const padded = Math.ceil(json.length / 4) * 4;
    const headerPickle = Buffer.alloc(8 + padded);
    headerPickle.writeUInt32LE(4 + padded, 0);
    headerPickle.writeUInt32LE(json.length, 4);
    json.copy(headerPickle, 8);
    const sizePickle = Buffer.alloc(8);
    sizePickle.writeUInt32LE(4, 0);
    sizePickle.writeUInt32LE(headerPickle.length, 4);
    return Buffer.concat([sizePickle, headerPickle, ...blobs]);
}

function stubAsar(patcherPath) {
    const index = `// ${MARKER} : généré par l'installateur Halo
"use strict";
try {
    require(${JSON.stringify(patcherPath)});
} catch (err) {
    // Halo absent ou en erreur : Discord démarre normalement
    console.error("[Halo] Chargement impossible, démarrage de Discord sans Halo :", err);
    const path = require("path");
    const asar = path.join(__dirname, "..", "_app.asar");
    const pkg = require(path.join(asar, "package.json"));
    require("electron").app.setAppPath(asar);
    require.main.filename = path.join(asar, pkg.main);
    require(require.main.filename);
}
`;
    return createAsar({
        "index.js": index,
        "package.json": JSON.stringify({ name: "discord", main: "index.js" })
    });
}

/* ------------------------------------------------------------ détection */

function compareVersions(a, b) {
    const pa = a.split(".").map(Number), pb = b.split(".").map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const d = (pa[i] || 0) - (pb[i] || 0);
        if (d) return d > 0 ? 1 : -1;
    }
    return 0;
}

function findInstalls() {
    const installs = [];
    for (const [branch, info] of Object.entries(BRANCHES)) {
        const root = path.join(LOCALAPPDATA, info.folder);
        let versions = [];
        try {
            versions = fs.readdirSync(root, { withFileTypes: true })
                .filter(e => e.isDirectory() && /^app-[\d.]+$/.test(e.name))
                .map(e => ({ version: e.name.slice(4), resources: path.join(root, e.name, "resources") }))
                .filter(v => fs.existsSync(v.resources))
                .sort((x, y) => compareVersions(y.version, x.version));
        } catch { }
        if (versions.length) installs.push({ branch, ...info, root, latest: versions[0], versions, state: getState(versions[0].resources) });
    }
    return installs;
}

function readHead(file, bytes = 8192) {
    try {
        const fd = fs.openSync(file, "r");
        const buf = Buffer.alloc(bytes);
        const n = fs.readSync(fd, buf, 0, bytes, 0);
        fs.closeSync(fd);
        return buf.subarray(0, n).toString("latin1");
    } catch {
        return "";
    }
}

// Le vrai app.asar de Discord pèse plusieurs Mo ; les relais (Halo, autres mods) quelques Ko.
const MIN_ORIGINAL_SIZE = 512 * 1024;

function isDiscordOriginal(file) {
    try {
        return fs.statSync(file).size >= MIN_ORIGINAL_SIZE && !readHead(file).includes("_STUB");
    } catch {
        return false;
    }
}

// halo | vanilla | prisme-prototype | autre-mod | original-manquant | inconnu
function getState(resources) {
    const asar = path.join(resources, "app.asar");
    const backup = path.join(resources, "_app.asar");
    const appDir = path.join(resources, "app");
    const appIndex = path.join(appDir, "index.js");
    const hasAsar = fs.existsSync(asar);
    const hasBackup = fs.existsSync(backup);

    // Jamais d'écriture si le fichier d'origine de Discord n'est plus là : on le signale.
    if (hasBackup && !isDiscordOriginal(backup)) return "original-manquant";
    if (!hasBackup && hasAsar && !isDiscordOriginal(asar)) return "original-manquant";

    if (fs.existsSync(appIndex)) {
        return fs.readFileSync(appIndex, "utf8").includes("PRISME_STUB") ? "prisme-prototype" : "autre-mod";
    }
    if (hasAsar && hasBackup) {
        return readHead(asar).includes(MARKER) ? "halo" : "autre-mod";
    }
    if (hasAsar) return "vanilla";
    return "inconnu";
}

const STATE_LABEL = {
    halo: c.green("Halo installé"),
    vanilla: c.dim("non modifié"),
    "prisme-prototype": c.yellow("ancien prototype Prisme (sera remplacé)"),
    "autre-mod": c.yellow("autre mod de Discord détecté"),
    "original-manquant": c.red("fichier d'origine de Discord manquant : réinstallez Discord depuis discord.com"),
    inconnu: c.red("état inconnu")
};

/* ------------------------------------------------------------ actions */

function removePrismePrototype(resources) {
    fs.rmSync(path.join(resources, "app"), { recursive: true, force: true });
    const asar = path.join(resources, "app.asar");
    const backup = path.join(resources, "_app.asar");
    if (fs.existsSync(backup) && !fs.existsSync(asar)) fs.renameSync(backup, asar);
}

function patch(resources, patcherPath) {
    let state = getState(resources);
    if (state === "prisme-prototype") {
        removePrismePrototype(resources);
        state = getState(resources);
    }
    if (state === "original-manquant") throw new Error("le fichier d'origine de Discord (app.asar) est introuvable : réinstallez Discord depuis discord.com, puis relancez l'installateur");
    if (state === "autre-mod") throw new Error("un autre mod est installé : désinstallez-le d'abord");
    if (state === "inconnu") throw new Error(`app.asar introuvable dans ${resources}`);

    const asar = path.join(resources, "app.asar");
    const backup = path.join(resources, "_app.asar");
    if (state === "vanilla") fs.renameSync(asar, backup);
    fs.writeFileSync(asar, stubAsar(patcherPath));
}

function unpatch(resources) {
    const state = getState(resources);
    if (state === "prisme-prototype") {
        removePrismePrototype(resources);
        return true;
    }
    if (state !== "halo") return false;
    const asar = path.join(resources, "app.asar");
    fs.rmSync(asar, { force: true });
    fs.renameSync(path.join(resources, "_app.asar"), asar);
    return true;
}

function copyDist() {
    const missing = DIST_FILES.filter(f => !fs.existsSync(path.join(DIST_SOURCE, f)));
    if (missing.length) throw new Error(`fichiers de build manquants (${missing.join(", ")}) : lancez d'abord « pnpm buildStandalone »`);
    fs.rmSync(HALO_DIST, { recursive: true, force: true });
    fs.mkdirSync(HALO_DIST, { recursive: true });
    for (const f of fs.readdirSync(DIST_SOURCE)) {
        if (/^(patcher|preload|renderer)\.(js|css)$/.test(f) || /\.LEGAL\.txt$/.test(f)) {
            fs.writeFileSync(path.join(HALO_DIST, f), fs.readFileSync(path.join(DIST_SOURCE, f)));
        }
    }
    return path.join(HALO_DIST, "patcher.js");
}

function isRunning(exe) {
    try {
        return execSync(`tasklist /FI "IMAGENAME eq ${exe}" /NH`, { encoding: "utf8" }).toLowerCase().includes(exe.toLowerCase());
    } catch {
        return false;
    }
}

let rl = null;
function ask(q) {
    rl ??= readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(r => rl.question(q, a => r(a.trim())));
}
async function confirm(q, yes, def = true) {
    if (yes) return true;
    const a = (await ask(`${q} ${def ? "[O/n]" : "[o/N]"} `)).toLowerCase();
    return a ? a.startsWith("o") || a.startsWith("y") : def;
}

async function closeDiscord(installs, yes) {
    const running = installs.filter(i => isRunning(i.exe));
    if (!running.length) return true;
    if (!await confirm(`${running.map(i => i.label).join(", ")} doit être fermé. Le fermer maintenant ?`, yes)) return false;
    for (const i of running) {
        try { execSync(`taskkill /IM ${i.exe} /F /T`, { stdio: "ignore" }); } catch { }
    }
    await new Promise(r => setTimeout(r, 2000));
    return true;
}

function relaunch(install) {
    const updater = path.join(install.root, "Update.exe");
    if (fs.existsSync(updater)) spawn(updater, ["--processStart", install.exe], { detached: true, stdio: "ignore" }).unref();
}

async function pickInstalls(branch, yes) {
    const all = findInstalls();
    if (branch && branch !== "all") return all.filter(i => i.branch === branch);
    if (yes || all.length <= 1) return all;
    console.log(c.bold("\nSur quelle(s) installation(s) ?"));
    all.forEach((i, n) => console.log(`  ${n + 1}. ${i.label}`));
    console.log(`  ${all.length + 1}. Toutes`);
    const n = parseInt(await ask("Choix : "), 10);
    return n >= 1 && n <= all.length ? [all[n - 1]] : all;
}

function status() {
    const installs = findInstalls();
    console.log(c.bold("\nInstallations de Discord :"));
    if (!installs.length) console.log(c.red("  Aucune trouvée."));
    for (const i of installs) console.log(`  • ${i.label.padEnd(18)} v${i.latest.version.padEnd(10)} ${STATE_LABEL[i.state]}`);
    console.log(c.dim(`\nDonnées Halo : ${HALO_DIR}`));
    return installs;
}

async function install({ branch, dev, yes }) {
    const installs = await pickInstalls(branch, yes);
    if (!installs.length) throw new Error("aucune installation de Discord trouvée");
    if (!await closeDiscord(installs, yes)) return console.log(c.yellow("Installation annulée."));

    const patcherPath = dev ? path.join(DIST_SOURCE, "patcher.js") : copyDist();
    if (dev && !fs.existsSync(patcherPath)) throw new Error("dist/patcher.js introuvable : lancez d'abord « pnpm build »");

    for (const i of installs) {
        try {
            patch(i.latest.resources, patcherPath);
            console.log(c.green(`  ✔ ${i.label} v${i.latest.version} : Halo installé${dev ? " (mode développement)" : ""}`));
        } catch (err) {
            console.log(c.red(`  ✖ ${i.label} : ${err.message}`));
        }
    }
    console.log(c.yellow("\nRappel : modifier le client est contraire aux conditions d'utilisation de Discord (voir README)."));
    if (await confirm("Relancer Discord maintenant ?", yes)) installs.forEach(relaunch);
}

async function uninstall({ branch, yes }) {
    const installs = await pickInstalls(branch, yes);
    if (!await closeDiscord(installs, yes)) return console.log(c.yellow("Désinstallation annulée."));
    for (const i of installs) {
        const n = i.versions.filter(v => {
            try { return unpatch(v.resources); } catch (err) { console.log(c.red(`  ✖ ${i.label} v${v.version} : ${err.message}`)); return false; }
        }).length;
        console.log(n ? c.green(`  ✔ ${i.label} : Discord d'origine restauré`) : c.dim(`  • ${i.label} : rien à retirer`));
    }
    console.log(c.dim(`Vos réglages et thèmes restent dans ${HALO_DIR}`));
}

async function menu() {
    console.log(c.blurple(c.bold("\n  ◯ Halo — installateur")));
    for (; ;) {
        status();
        console.log(c.bold("\n  1. Installer / réparer Halo\n  2. Désinstaller Halo\n  0. Quitter"));
        const choice = await ask("\nChoix : ");
        try {
            if (choice === "1") await install({});
            else if (choice === "2") await uninstall({});
            else break;
        } catch (err) {
            console.log(c.red(`Erreur : ${err.message}`));
        }
    }
}

async function main() {
    if (process.platform !== "win32") throw new Error("cet installateur est prévu pour Windows");
    try { execSync("chcp 65001", { stdio: "ignore" }); } catch { }
    const args = process.argv.slice(2);
    const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
    const flags = { branch: opt("--branch"), dev: args.includes("--dev"), yes: args.includes("--yes") };
    if (flags.branch && flags.branch !== "all" && !BRANCHES[flags.branch]) throw new Error(`branche inconnue : ${flags.branch}`);

    if (args.includes("--install")) await install(flags);
    else if (args.includes("--uninstall")) await uninstall(flags);
    else if (args.includes("--status")) status();
    else await menu();
}

if (require.main === module) {
    main().catch(err => {
        console.error(c.red(`\nErreur : ${err.message}`));
        process.exitCode = 1;
    }).finally(() => rl?.close());
}

module.exports = { createAsar, getState, patch, unpatch };
