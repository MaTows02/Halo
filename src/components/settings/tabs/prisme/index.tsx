/*
 * Halo, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import "./styles.css";

import { openNotificationLogModal } from "@api/Notifications/notificationLog";
import { isPluginEnabled } from "@api/PluginManager";
import { useSettings } from "@api/Settings";
import { Button } from "@components/Button";
import { FormSwitch } from "@components/FormSwitch";
import { Heading } from "@components/Heading";
import { ClockIcon, FolderIcon, GithubIcon, HaloIcon, LogIcon, NotesIcon, PaintbrushIcon, RestartIcon } from "@components/Icons";
import { Paragraph } from "@components/Paragraph";
import { QuickAction, QuickActionCard } from "@components/settings/QuickAction";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { openPluginModal } from "@components/settings/tabs/plugins/PluginModal";
import NoTrack from "@plugins/_core/noTrack";
import SettingsPlugin from "@plugins/_core/settings";
import { gitHash, gitRemote } from "@shared/prismeUserAgent";
import { IS_WINDOWS } from "@utils/constants";
import { classNameFactory } from "@utils/css";
import { getDiscordLocale, HaloLanguages, HaloLanguageSetting, I18nKey, t, useHaloLanguage } from "@utils/i18n";
import { Margins } from "@utils/margins";
import { relaunch } from "@utils/native";
import { promptToRestart } from "@utils/promptToRestart";
import { React, Select } from "@webpack/common";

import Plugins from "~plugins";

import { MacOSVibrancySettings } from "./MacVibrancySettings";
import { NotificationSection } from "./NotificationSettings";
import { openPlayground } from "./playground";
import { WindowsMaterialSettings } from "./WindowsMaterialSettings";

const cl = classNameFactory("vc-halo-home-");

type KeysOfType<Object, Type> = {
    [K in keyof Object]: Object[K] extends Type ? K : never;
}[keyof Object];

function Switches() {
    const settings = useSettings(["useQuickCss", "enableReactDevtools", "frameless", "nativeTitleBar", "transparent", "winCtrlQ", "disableMinSize"]);
    const { disableAnalytics } = NoTrack.settings.use(["disableAnalytics"]);

    const Switches = [
        {
            key: "useQuickCss",
            title: "switch.quickCss.title",
            description: "switch.quickCss.desc"
        },
        {
            value: disableAnalytics,
            updateSetting(newValue) {
                NoTrack.settings.store.disableAnalytics = newValue;
            },
            reactKey: "NoTrack::disableAnalytics",
            key: null!,
            title: "switch.analytics.title",
            description: "switch.analytics.desc",
            restartRequired: NoTrack.settings.def.disableAnalytics.restartNeeded,
        },
        IS_DISCORD_DESKTOP && {
            key: "nativeTitleBar",
            title: "switch.nativeTitleBar.title",
            restartRequired: true
        },
        !IS_WEB && {
            key: "transparent",
            title: "switch.transparent.title",
            description: "switch.transparent.desc",
            restartRequired: true
        },
        IS_DISCORD_DESKTOP && {
            key: "disableMinSize",
            title: "switch.disableMinSize.title",
            description: "switch.disableMinSize.desc",
            restartRequired: true
        },
        !IS_WEB && IS_WINDOWS && {
            key: "winCtrlQ",
            title: "switch.winCtrlQ.title",
            restartRequired: true
        },
        !IS_WEB && {
            key: "enableReactDevtools",
            title: "switch.reactDevtools.title",
            description: "switch.reactDevtools.desc",
            restartRequired: true
        },
    ] satisfies Array<false | {
        key: KeysOfType<typeof settings, boolean>;
        reactKey?: string;
        title: I18nKey;
        description?: I18nKey;
        restartRequired?: boolean;
        updateSetting?(newValue: boolean): void;
        value?: boolean;
    }>;

    return Switches.map(setting => {
        if (!setting) {
            return null;
        }

        const { reactKey, key, value, title, description, restartRequired, updateSetting = v => (settings[key] = v) } = setting;

        return (
            <FormSwitch
                key={reactKey ?? key}
                title={t(title)}
                description={description && t(description)}
                value={value ?? settings[key]}
                hideBorder
                onChange={v => {
                    updateSetting(v);

                    if (restartRequired) {
                        promptToRestart("relaunch");
                    }
                }}
            />
        );
    });
}

function Hero() {
    const { enabledThemes, themeLinks } = useSettings(["enabledThemes", "themeLinks", "plugins.*.enabled"]);

    const activePlugins = Object.values(Plugins)
        .filter(p => !p.required && !p.hidden && !p.name.endsWith("API") && isPluginEnabled(p.name))
        .length;
    const activeThemes = enabledThemes.length + themeLinks.length;

    return (
        <div className={cl("hero")}>
            <div className={cl("hero-glow")} />
            <div className={cl("hero-main")}>
                <div className={cl("logo")}>
                    <HaloIcon width={44} height={44} />
                </div>
                <div className={cl("hero-text")}>
                    <h2 className={cl("title")}>Halo</h2>
                    <p className={cl("tagline")}>{t("main.tagline")}</p>
                </div>
                <Button
                    size="small"
                    variant="overlayPrimary"
                    className={cl("source")}
                    onClick={() => PrismeNative.native.openExternal("https://github.com/" + gitRemote)}
                >
                    <GithubIcon height={16} width={16} />
                    {t("main.qa.source")}
                </Button>
            </div>
            <p className={cl("description")}>{t("main.description")}</p>
            <div className={cl("stats")}>
                <div className={cl("stat")}><b>{activePlugins}</b><span>{t("main.stats.plugins")}</span></div>
                <div className={cl("stat")}><b>{activeThemes}</b><span>{t("main.stats.themes")}</span></div>
                <div className={cl("stat")}><b>{gitHash}</b><span>{t("main.stats.version")}</span></div>
            </div>
        </div>
    );
}

function LanguagePicker() {
    const settings = useSettings(["haloLanguage"]);
    const discordLanguage = new Intl.DisplayNames([getDiscordLocale()], { type: "language" }).of(getDiscordLocale()) ?? getDiscordLocale();

    const options: { label: string; value: HaloLanguageSetting; default?: boolean; }[] = [
        { label: t("main.language.auto", { language: discordLanguage }), value: "auto", default: true },
        ...Object.entries(HaloLanguages).map(([value, label]) => ({ label, value: value as HaloLanguageSetting }))
    ];

    return (
        <section className={cl("card")}>
            <Heading tag="h4">{t("main.language.title")}</Heading>
            <Paragraph className={Margins.bottom8} style={{ color: "var(--text-muted)" }}>
                {t("main.language.description")}
            </Paragraph>
            <Select
                options={options}
                closeOnSelect={true}
                select={v => settings.haloLanguage = v}
                isSelected={v => v === settings.haloLanguage}
                serialize={String}
            />
        </section>
    );
}

function HaloSettings() {
    useHaloLanguage();

    return (
        <SettingsTab>
            <Hero />

            <LanguagePicker />

            <section className={cl("section")}>
                <Heading tag="h4" className={Margins.bottom8}>{t("main.quickActions")}</Heading>

                <QuickActionCard>
                    {!IS_WEB && Prisme.Plugins.plugins.HaloPerformance && (
                        <QuickAction
                            Icon={ClockIcon}
                            text={t("main.qa.performance")}
                            action={() => openPluginModal(Prisme.Plugins.plugins.HaloPerformance)}
                        />
                    )}
                    {Prisme.Plugins.plugins.HaloBlocNotes && (
                        <QuickAction
                            Icon={NotesIcon}
                            text={t("main.qa.notes")}
                            action={() => openPluginModal(Prisme.Plugins.plugins.HaloBlocNotes)}
                        />
                    )}
                    <QuickAction
                        Icon={LogIcon}
                        text={t("main.qa.notificationLog")}
                        action={openNotificationLogModal}
                    />
                    <QuickAction
                        Icon={PaintbrushIcon}
                        text={t("main.qa.quickCss")}
                        action={() => PrismeNative.quickCss.openEditor()}
                    />
                    {!IS_WEB && (
                        <>
                            <QuickAction
                                Icon={RestartIcon}
                                text={t("main.qa.relaunch")}
                                action={relaunch}
                            />
                            <QuickAction
                                Icon={FolderIcon}
                                text={t("main.qa.settingsFolder")}
                                action={() => PrismeNative.settings.openFolder()}
                            />
                        </>
                    )}
                    {IS_DEV && <QuickAction
                        Icon={PaintbrushIcon}
                        text={t("main.qa.playground")}
                        action={() => openPlayground()}
                    />}
                </QuickActionCard>
            </section>

            <section className={cl("card")}>
                <Heading tag="h4" className={Margins.bottom8}>{t("main.settings")}</Heading>
                <Paragraph className={Margins.bottom16} style={{ color: "var(--text-muted)" }}>
                    {t("main.settings.hintBefore")}
                    <a onClick={() => openPluginModal(SettingsPlugin)}>{t("main.settings.hintLink")}</a>
                    {t("main.settings.hintAfter")}
                </Paragraph>

                <div className="vc-settings-switches">
                    <Switches />
                </div>
            </section>

            <MacOSVibrancySettings />
            <WindowsMaterialSettings />

            <NotificationSection />
        </SettingsTab>
    );
}

export default wrapTab(HaloSettings, "Halo");
