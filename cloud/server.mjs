/*
 * Halo, a Discord client mod
 * Copyright (c) 2026 Halo contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// Halo Cloud : petit serveur de synchronisation des réglages, sans dépendance (Node.js 20+).
// Documentation : docs/CLOUD.md
//
// Variables d'environnement :
//   DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET  application créée sur discord.com/developers
//   PUBLIC_URL      adresse publique du serveur, ex. https://cloud.exemple.fr
//   PORT            port d'écoute (8080 par défaut)
//   DATA_DIR        dossier des données (./data par défaut)
//   ALLOWED_USERS   (facultatif) ID Discord autorisés, séparés par des virgules
//   SIZE_LIMIT      taille maximale des réglages en octets (32 Mo par défaut)

import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { createServer } from "http";
import { join } from "path";

const {
    DISCORD_CLIENT_ID = "",
    DISCORD_CLIENT_SECRET = "",
    PUBLIC_URL = "",
    PORT = "8080",
    DATA_DIR = "./data",
    ALLOWED_USERS = "",
    SIZE_LIMIT = String(32 * 1024 * 1024)
} = process.env;

const REDIRECT_URI = `${PUBLIC_URL.replace(/\/$/, "")}/v1/oauth/callback`;
const allowedUsers = ALLOWED_USERS.split(",").map(s => s.trim()).filter(Boolean);
const sizeLimit = Number(SIZE_LIMIT);

mkdirSync(DATA_DIR, { recursive: true });

const userFile = id => join(DATA_DIR, `${id}.json`);
const settingsFile = id => join(DATA_DIR, `${id}.bin`);
const hash = value => createHash("sha256").update(value).digest();

function readUser(id) {
    try {
        return JSON.parse(readFileSync(userFile(id), "utf8"));
    } catch {
        return null;
    }
}

// En-tête envoyé par Halo : base64("secret:idDiscord")
function authenticate(req) {
    try {
        const [secret, id] = Buffer.from(req.headers.authorization ?? "", "base64").toString().split(":");
        if (!/^\d{5,25}$/.test(id ?? "")) return null;
        const user = readUser(id);
        if (!user || !timingSafeEqual(hash(secret), hash(user.secret))) return null;
        return id;
    } catch {
        return null;
    }
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        req.on("data", chunk => {
            size += chunk.length;
            if (size > sizeLimit) {
                reject(new Error("too large"));
                req.destroy();
            } else chunks.push(chunk);
        });
        req.on("end", () => resolve(Buffer.concat(chunks)));
        req.on("error", reject);
    });
}

function send(res, status, body, headers = {}) {
    const isJson = body != null && !Buffer.isBuffer(body);
    res.writeHead(status, {
        // Les requêtes viennent de la page de Discord : CORS est indispensable
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type, If-None-Match, Accept",
        "Access-Control-Expose-Headers": "ETag",
        ...(isJson ? { "Content-Type": "application/json" } : {}),
        ...headers
    });
    res.end(isJson ? JSON.stringify(body) : body ?? undefined);
}

async function oauthCallback(url, res) {
    const code = url.searchParams.get("code");
    if (!code) return send(res, 400, { error: "Missing code" });

    const token = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
            grant_type: "authorization_code",
            code,
            redirect_uri: REDIRECT_URI,
            scope: "identify"
        })
    }).then(r => r.json());
    if (!token.access_token) return send(res, 400, { error: "Invalid code" });

    const me = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${token.access_token}` }
    }).then(r => r.json());
    if (!me.id) return send(res, 500, { error: "Failed to request user" });
    if (allowedUsers.length && !allowedUsers.includes(me.id)) return send(res, 403, { error: "User is not whitelisted" });

    // Le même secret est renvoyé à chaque appareil de l'utilisateur, pour qu'ils restent tous connectés
    const user = readUser(me.id) ?? { secret: randomBytes(48).toString("hex") };
    writeFileSync(userFile(me.id), JSON.stringify(user), { mode: 0o600 });
    send(res, 200, { secret: user.secret });
}

async function handle(req, res) {
    const url = new URL(req.url, "http://localhost");
    const route = `${req.method} ${url.pathname.replace(/\/+$/, "") || "/"}`;

    if (req.method === "OPTIONS") return send(res, 204);
    if (route === "GET /" || route === "GET /v1") return send(res, 200, { ping: "pong", service: "halo-cloud" });
    if (route === "GET /v1/oauth/settings") return send(res, 200, { clientId: DISCORD_CLIENT_ID, redirectUri: REDIRECT_URI });
    if (route === "GET /v1/oauth/callback") return oauthCallback(url, res);

    const userId = authenticate(req);
    if (!userId) return send(res, 401, { error: "Unauthorized" });

    switch (route) {
        case "GET /v1/settings": {
            if (!existsSync(settingsFile(userId))) return send(res, 404, { error: "Not found" });
            const { written } = readUser(userId);
            if (req.headers["if-none-match"] === String(written)) return send(res, 304);
            return send(res, 200, readFileSync(settingsFile(userId)), { "Content-Type": "application/octet-stream", ETag: String(written) });
        }
        case "PUT /v1/settings": {
            if (req.headers["content-type"] !== "application/octet-stream") return send(res, 415, { error: "Content type must be application/octet-stream" });
            const body = await readBody(req).catch(() => null);
            if (!body) return send(res, 413, { error: "Settings are too large" });
            const written = Date.now();
            writeFileSync(settingsFile(userId), body, { mode: 0o600 });
            writeFileSync(userFile(userId), JSON.stringify({ ...readUser(userId), written }), { mode: 0o600 });
            return send(res, 200, { written });
        }
        case "DELETE /v1/settings":
            rmSync(settingsFile(userId), { force: true });
            return send(res, 204);
        case "DELETE /v1":
        case "DELETE /":
            rmSync(settingsFile(userId), { force: true });
            rmSync(userFile(userId), { force: true });
            return send(res, 204);
        default:
            return send(res, 404, { error: "Not found" });
    }
}

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !PUBLIC_URL) {
    console.warn("Attention : DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET et PUBLIC_URL doivent être définis pour la connexion Discord (voir docs/CLOUD.md).");
}

createServer((req, res) => {
    handle(req, res).catch(err => {
        console.error(err);
        if (!res.headersSent) send(res, 500, { error: "Internal error" });
    });
}).listen(Number(PORT), () => console.log(`Halo Cloud écoute sur le port ${PORT} (adresse publique : ${PUBLIC_URL || "non définie"})`));
