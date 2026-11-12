/*
 * Halo, a Discord client mod
 * Copyright (c) 2026 Halo contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getHaloLanguage, HaloLanguage } from "./index";
import fr from "./plugins.fr";

export interface PluginTranslation {
    /** Plugin description */
    d?: string;
    /** Setting descriptions, by setting key */
    s?: Record<string, string>;
    /** Select option labels, by original (English) label */
    o?: Record<string, string>;
}

export interface PluginTranslations {
    tags: Record<string, string>;
    plugins: Record<string, PluginTranslation>;
}

// English is the source language of plugins, so it needs no dictionary
const dictionaries: Partial<Record<HaloLanguage, PluginTranslations>> = { fr };

const current = () => dictionaries[getHaloLanguage()];

/** Plugin description in the current Halo language */
export function pluginDescription(plugin: { name: string; description: string; }): string {
    return current()?.plugins[plugin.name]?.d ?? plugin.description;
}

/** Plugin tag (category) in the current Halo language */
export function tagLabel(tag: string): string {
    return current()?.tags[tag] ?? tag;
}

/**
 * Returns a view of a plugin setting with its texts translated.
 * The original definition is left untouched and stays reachable through the prototype chain.
 */
export function localizeSetting<T extends object>(pluginName: string, key: string, setting: T): T {
    const translation = current()?.plugins[pluginName];
    if (!translation) return setting;

    const overrides: PropertyDescriptorMap = {};

    const description = translation.s?.[key];
    if (description) {
        // The default title is derived from the English setting key, so the translated description replaces it
        overrides.displayName = { value: description, enumerable: true };
        overrides.description = { value: "", enumerable: true };
    }

    const { options } = setting as { options?: { label: string; }[]; };
    if (Array.isArray(options) && translation.o) {
        const labels = translation.o;
        overrides.options = {
            value: options.map(o => labels[o.label] ? { ...o, label: labels[o.label] } : o),
            enumerable: true
        };
    }

    return Object.keys(overrides).length ? Object.create(setting, overrides) : setting;
}
