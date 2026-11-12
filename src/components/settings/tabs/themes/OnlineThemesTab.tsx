/*
 * Halo, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useSettings } from "@api/Settings";
import { Card } from "@components/Card";
import { Flex } from "@components/Flex";
import { Heading } from "@components/Heading";
import { Margins } from "@components/margins";
import { Paragraph } from "@components/Paragraph";
import { t } from "@utils/i18n";
import { TextArea, useState } from "@webpack/common";

export function OnlineThemesTab() {
    const settings = useSettings(["themeLinks"]);

    const [themeText, setThemeText] = useState(settings.themeLinks.join("\n"));

    // When the user leaves the online theme textbox, update the settings
    function onBlur() {
        settings.themeLinks = [...new Set(
            themeText
                .trim()
                .split(/\n+/)
                .map(s => s.trim())
                .filter(Boolean)
        )];
    }

    return (
        <Flex flexDirection="column" gap="1em">
            <Card variant="warning" defaultPadding>
                <Paragraph>
                    {t("themes.online.warning")}
                </Paragraph>
            </Card>
            <Card>
                <Heading className={Margins.bottom8}>{t("themes.online.paste")}</Heading>
                <Paragraph>{t("themes.online.oneLink")}</Paragraph>
                <Paragraph>{t("themes.online.prefix")}</Paragraph>
                <Paragraph>{t("themes.online.direct")}</Paragraph>
            </Card>

            <section>
                <Heading className={Margins.bottom8}>{t("themes.online")}</Heading>
                <TextArea
                    value={themeText}
                    onChange={setThemeText}
                    className={"vc-settings-theme-links"}
                    placeholder={t("themes.online.placeholder")}
                    spellCheck={false}
                    onBlur={onBlur}
                    rows={10}
                />
            </section>
        </Flex>
    );
}
