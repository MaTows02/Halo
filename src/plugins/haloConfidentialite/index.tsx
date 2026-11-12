/*
 * Halo, a Discord client mod
 * Copyright (c) 2026 Halo contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ChatBarButton, ChatBarButtonFactory } from "@api/ChatButtons";
import { definePluginSettings } from "@api/Settings";
import { managedStyleRootNode } from "@api/Styles";
import { Devs } from "@utils/constants";
import { createAndAppendStyle } from "@utils/css";
import { t } from "@utils/i18n";
import definePlugin, { IconComponent, OptionType } from "@utils/types";
import { React, showToast, useEffect, useState } from "@webpack/common";

const ACTIVE_CLASS = "vc-halo-blur";

const settings = definePluginSettings({
    avatars: { type: OptionType.BOOLEAN, get displayName() { return t("privacy.avatars"); }, description: "", default: true, onChange: () => setCss() },
    noms: { type: OptionType.BOOLEAN, get displayName() { return t("privacy.names"); }, description: "", default: true, onChange: () => setCss() },
    messages: { type: OptionType.BOOLEAN, get displayName() { return t("privacy.messages"); }, description: "", default: false, onChange: () => setCss() },
    medias: { type: OptionType.BOOLEAN, get displayName() { return t("privacy.media"); }, description: "", default: true, onChange: () => setCss() },
    intensite: {
        type: OptionType.SLIDER,
        get displayName() { return t("privacy.intensity"); }, description: "",
        markers: [2, 4, 6, 8, 12, 16, 24],
        default: 8,
        stickToMarkers: true,
        onChange: () => setCss()
    },
    actifAuDemarrage: { type: OptionType.BOOLEAN, get displayName() { return t("privacy.onStartup"); }, description: "", default: false }
});

const SELECTORS = {
    avatars: ['[class*="avatar"] img', 'img[class*="avatar"]', '[class*="avatar"] svg'],
    noms: ['[class*="username"]', '[class*="nameAndDecorators"]', '[class*="panelTitleContainer"]'],
    messages: ['[id^="message-content-"]'],
    medias: ['[class*="imageWrapper"]', '[class*="embedVideo"]', '[class*="mosaicItem"]', '[class*="embedImage"]']
};

let style: HTMLStyleElement | null = null;
const listeners = new Set<(active: boolean) => void>();

const isActive = () => document.documentElement.classList.contains(ACTIVE_CLASS);

function setActive(active: boolean, notify = true) {
    document.documentElement.classList.toggle(ACTIVE_CLASS, active);
    listeners.forEach(fn => fn(active));
    if (notify) showToast({ text: t(active ? "privacy.on" : "privacy.off") });
}

function setCss() {
    if (!style) return;
    const { store } = settings;
    const selectors = (Object.keys(SELECTORS) as (keyof typeof SELECTORS)[])
        .filter(key => store[key])
        .flatMap(key => SELECTORS[key]);

    style.textContent = selectors.length
        ? `${selectors.map(s => `.${ACTIVE_CLASS} ${s}`).join(",\n")} {
            filter: blur(${store.intensite}px) !important;
            transition: filter .15s ease;
        }
        ${selectors.map(s => `.${ACTIVE_CLASS} ${s}:hover`).join(",\n")} { filter: none !important; }`
        : "";
}

function onKeyDown(e: KeyboardEvent) {
    // AltGr (Ctrl+Alt sur clavier AZERTY) ne déclenche pas le raccourci
    if (e.getModifierState("AltGraph")) return;
    if (e.ctrlKey && e.altKey && !e.shiftKey && e.code === "KeyB") {
        e.preventDefault();
        setActive(!isActive());
    }
}

const EyeIcon: IconComponent = ({ height = 20, width = 20, className }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
        <path fill="currentColor" d="M12 5C6.5 5 2.7 9.3 1.5 12c1.2 2.7 5 7 10.5 7s9.3-4.3 10.5-7C21.3 9.3 17.5 5 12 5Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </svg>
);

const EyeOffIcon: IconComponent = props => (
    <svg width={props.width ?? 20} height={props.height ?? 20} viewBox="0 0 24 24" className={props.className}>
        <path fill="currentColor" d="M12 5C6.5 5 2.7 9.3 1.5 12c1.2 2.7 5 7 10.5 7s9.3-4.3 10.5-7C21.3 9.3 17.5 5 12 5Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" opacity=".35" />
        <path fill="var(--status-danger)" d="m3.3 2 18.7 18.7-1.4 1.4L1.9 3.4z" />
    </svg>
);

const BlurToggle: ChatBarButtonFactory = ({ isMainChat }) => {
    const [active, setActiveState] = useState(isActive());

    useEffect(() => {
        listeners.add(setActiveState);
        return () => void listeners.delete(setActiveState);
    }, []);

    if (!isMainChat) return null;

    return (
        <ChatBarButton
            tooltip={t(active ? "privacy.tooltipOn" : "privacy.tooltipOff")}
            onClick={() => setActive(!active)}
        >
            {active ? <EyeOffIcon /> : <EyeIcon />}
        </ChatBarButton>
    );
};

export default definePlugin({
    name: "HaloConfidentialite",
    description: "Blurs avatars, names, messages and media until hovered, to share your screen or stream with peace of mind (Ctrl+Alt+B)",
    tags: ["Privacy", "Appearance"],
    authors: [Devs.Halo],
    settings,

    chatBarButton: {
        icon: EyeIcon,
        render: BlurToggle
    },

    start() {
        style = createAndAppendStyle("HaloConfidentialite", managedStyleRootNode);
        setCss();
        setActive(settings.store.actifAuDemarrage, false);
        document.addEventListener("keydown", onKeyDown, true);
    },

    stop() {
        document.removeEventListener("keydown", onKeyDown, true);
        setActive(false, false);
        style?.remove();
        style = null;
    }
});
