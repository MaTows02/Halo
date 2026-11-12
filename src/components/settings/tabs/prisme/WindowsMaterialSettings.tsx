/*
 * Halo, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Heading } from "@components/Heading";
import { Margins } from "@components/margins";
import { Paragraph } from "@components/Paragraph";
import { IS_WINDOWS } from "@utils/constants";
import { t } from "@utils/i18n";
import { Select } from "@webpack/common";

export function WindowsMaterialSettings() {
    const settings = useSettings(["windowsMaterial"]);

    if (!IS_WINDOWS || IS_WEB || !PrismeNative.native.supportsWindowsMaterial()) return null;

    return (
        <ErrorBoundary noop>
            <Heading className={Margins.bottom8}>{t("material.title")}</Heading>
            <Paragraph className={Margins.bottom8}>
                {t("material.desc")}
            </Paragraph>

            <Select
                placeholder={t("common.none")}
                options={[
                    {
                        label: t("common.none"),
                        value: "none",
                        default: true
                    },
                    {
                        label: t("material.mica"),
                        value: "mica"
                    },
                    {
                        label: t("material.tabbed"),
                        value: "tabbed"
                    },
                    {
                        label: t("material.acrylic"),
                        value: "acrylic"
                    }
                ]}
                closeOnSelect={true}
                select={v => (settings.windowsMaterial = v)}
                isSelected={v => v === settings.windowsMaterial}
                serialize={s => s}
            />
        </ErrorBoundary>
    );
}
