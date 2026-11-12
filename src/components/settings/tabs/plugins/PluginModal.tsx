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

import "./PluginModal.css";

import { hasAnyVisibleSettings, isSettingHidden } from "@api/PluginManager";
import { useSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Heading } from "@components/Heading";
import { Paragraph } from "@components/Paragraph";
import { RenderModalProps } from "@prisme/discord-types";
import { debounce } from "@shared/debounce";
import { gitRemote } from "@shared/prismeUserAgent";
import { classNameFactory } from "@utils/css";
import { t } from "@utils/i18n";
import { localizeSetting, pluginDescription, tagLabel } from "@utils/i18n/plugins";
import { Margins } from "@utils/margins";
import { classes } from "@utils/misc";
import { OptionType, Plugin, PluginTag } from "@utils/types";
import { Modal, openModal, React } from "@webpack/common";

import { PluginMeta } from "~plugins";

import { OptionComponentMap } from "./components";
import { FavoriteButton, GithubButton } from "./PluginModalButtons";

const cl = classNameFactory("vc-plugin-modal-");

interface PluginModalProps extends RenderModalProps {
    plugin: Plugin;
    onRestartNeeded(key: string): void;
}

function PluginTags({ tags }: { tags: PluginTag[]; }) {
    return (
        <div className={cl("tags")}>
            {tags.map(tag => (
                <div key={tag} className={cl("tag")}>{tagLabel(tag)}</div>
            ))}
        </div>
    );
}

export default function PluginModal({ plugin, onRestartNeeded, onClose, transitionState }: PluginModalProps) {
    const pluginSettings = useSettings([`plugins.${plugin.name}.*`]).plugins[plugin.name];
    const hasSettings = hasAnyVisibleSettings(plugin);

    function renderSettings() {
        const { settings } = plugin;
        if (!hasSettings || !settings)
            return <Paragraph>{t("plugins.modal.noSettings")}</Paragraph>;

        const options = Object.entries(settings.def).map(([key, setting]) => {
            if (setting.type === OptionType.CUSTOM) return null;

            if (isSettingHidden(settings, setting)) return null;

            function onChange(newValue: any) {
                const option = plugin.settings!.def[key];
                if (!option || option.type === OptionType.CUSTOM) return;

                pluginSettings[key] = newValue;

                if (option.restartNeeded) onRestartNeeded(key);
            }

            const Component = OptionComponentMap[setting.type];
            return (
                <ErrorBoundary noop key={key}>
                    <Component
                        id={key}
                        setting={localizeSetting(plugin.name, key, setting) as any}
                        onChange={debounce(onChange)}
                        pluginSettings={pluginSettings}
                        definedSettings={settings}
                        closePluginSettings={onClose}
                    />
                </ErrorBoundary>
            );
        });

        return (
            <div className="vc-plugins-settings">
                {options}
            </div>
        );
    }

    const pluginMeta = PluginMeta[plugin.name];

    return (
        <Modal
            transitionState={transitionState}
            onClose={onClose}
            size="lg"
            title={
                <div className={cl("header")}>
                    <Heading tag="h3">{plugin.name}</Heading>
                    {!pluginMeta.userPlugin && (
                        <div className="vc-settings-modal-links">
                            <FavoriteButton
                                isFavorite={pluginSettings.isFavorite ?? false}
                                onClick={() => pluginSettings.isFavorite = !pluginSettings.isFavorite}
                            />
                            <GithubButton
                                text={t("plugins.modal.source")}
                                href={`https://github.com/${gitRemote}/tree/main/src/plugins/${pluginMeta.folderName}`}
                            />
                        </div>
                    )}
                </div>
            }
            subtitle={
                <div className={cl("info")}>
                    <div>
                        <Paragraph>{pluginDescription(plugin)}</Paragraph>
                        {!!plugin.tags?.length && <PluginTags tags={plugin.tags} />}
                    </div>
                </div>
            }
        >
            <div className={"vc-settings-modal-content"}>
                {!!plugin.settingsAboutComponent && (
                    <div className={Margins.top16}>
                        <section>
                            <ErrorBoundary message={t("plugins.modal.infoError")}>
                                <plugin.settingsAboutComponent />
                            </ErrorBoundary>
                        </section>
                    </div>
                )}

                <section>
                    <Heading tag="h3" className={classes(Margins.top16, Margins.bottom8)}>{t("plugins.modal.settings")}</Heading>
                    {renderSettings()}
                </section>
            </div>
        </Modal>
    );
}

export function openPluginModal(plugin: Plugin, onRestartNeeded?: (pluginName: string, key: string) => void) {
    openModal(modalProps => (
        <PluginModal
            {...modalProps}
            plugin={plugin}
            onRestartNeeded={(key: string) => onRestartNeeded?.(plugin.name, key)}
        />
    ));
}
