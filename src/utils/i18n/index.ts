/*
 * Halo, a Discord client mod
 * Copyright (c) 2026 Halo contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Settings, useSettings } from "@api/Settings";
import { LocaleStore, useStateFromStores } from "@webpack/common";

import en from "./en";
import fr from "./fr";

export type I18nKey = keyof typeof en;

/** Languages Halo is translated into, with their native names */
export const HaloLanguages = {
    fr: "Français",
    en: "English"
} as const;

export type HaloLanguage = keyof typeof HaloLanguages;
export type HaloLanguageSetting = HaloLanguage | "auto";

const dictionaries: Record<HaloLanguage, Record<I18nKey, string>> = { en, fr };

/** Discord's interface language, e.g. "fr" or "en-US" */
export function getDiscordLocale(): string {
    // Can be called before the page exists (module init in the preload): every source is optional
    return LocaleStore?.locale || document.documentElement?.lang || navigator.language || "en";
}

/** Resolves the language to display, following Discord when the setting is "auto" */
export function getHaloLanguage(): HaloLanguage {
    const setting = Settings?.haloLanguage ?? "auto";
    const raw = setting === "auto" ? getDiscordLocale() : setting;
    const short = raw.toLowerCase().split("-")[0];
    return short in dictionaries ? short as HaloLanguage : "en";
}

/** Translates a key, replacing {placeholders} with the given values */
export function t(key: I18nKey, vars?: Record<string, string | number>): string {
    const text = dictionaries[getHaloLanguage()][key] ?? en[key] ?? key;
    if (!vars) return text;
    return text.replace(/\{(\w+)\}/g, (match, name) => name in vars ? String(vars[name]) : match);
}

/** Re-renders the component when the Halo language setting or Discord's language changes */
export function useHaloLanguage(): HaloLanguage {
    useSettings(["haloLanguage"]);
    useStateFromStores([LocaleStore], () => LocaleStore.locale);
    return getHaloLanguage();
}
