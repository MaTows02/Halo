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

import { downloadSettingsBackup, uploadSettingsBackup } from "@api/SettingsSync/offline";
import { Button } from "@components/Button";
import { Card } from "@components/Card";
import { Flex } from "@components/Flex";
import { Heading } from "@components/Heading";
import { Paragraph } from "@components/Paragraph";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { Text } from "@components/Text";
import { t, useHaloLanguage } from "@utils/i18n";
import { Margins } from "@utils/margins";

function BackupAndRestoreTab() {
    useHaloLanguage();
    return (
        <SettingsTab>
            <Flex flexDirection="column" gap="0.5em">
                <Card variant="warning">
                    <Heading tag="h4">{t("backup.warning.title")}</Heading>
                    <Paragraph>{t("backup.warning.desc")}</Paragraph>
                </Card>

                <Paragraph size="md" className={Margins.bottom8}>
                    {t("backup.desc")}
                </Paragraph>

                <Heading tag="h4">{t("backup.contains")}</Heading>
                <Text size="md" className={Margins.bottom8}>
                    <ul>
                        <li>&mdash; {t("backup.quickCss")}</li>
                        <li>&mdash; {t("backup.themeLinks")}</li>
                        <li>&mdash; {t("backup.pluginSettings")}</li>
                    </ul>
                </Text>

                <Flex>
                    <Button onClick={() => uploadSettingsBackup()}>
                        {t("backup.import")}
                    </Button>
                    <Button onClick={downloadSettingsBackup}>
                        {t("backup.export")}
                    </Button>
                </Flex>
            </Flex>
        </SettingsTab >
    );
}

export default wrapTab(BackupAndRestoreTab, "Backup & Restore");
