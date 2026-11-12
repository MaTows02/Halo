/*
 * Halo, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { openNotificationLogModal } from "@api/Notifications/notificationLog";
import { useSettings } from "@api/Settings";
import { Button } from "@components/Button";
import { ErrorCard } from "@components/ErrorCard";
import { Flex } from "@components/Flex";
import { Heading } from "@components/Heading";
import { Paragraph } from "@components/Paragraph";
import { t } from "@utils/i18n";
import { Margins } from "@utils/margins";
import { identity } from "@utils/misc";
import { Modal, openModal, Select, Slider } from "@webpack/common";

export function NotificationSection() {
    return (
        <section className={Margins.top16}>
            <Heading className={Margins.bottom8}>{t("notif.title")}</Heading>
            <Paragraph className={Margins.bottom8}>
                {t("notif.desc")}
            </Paragraph>
            <Flex>
                <Button onClick={openNotificationSettingsModal}>
                    {t("notif.settings")}
                </Button>
                <Button onClick={openNotificationLogModal}>
                    {t("notif.log")}
                </Button>
            </Flex>
        </section>
    );
}

export function openNotificationSettingsModal() {
    openModal(props => (
        <Modal
            {...props}
            size="lg"
            title={t("notif.settings")}
        >
            <NotificationSettings />
        </Modal>
    ));
}

function NotificationSettings() {
    const settings = useSettings(["notifications.*"]).notifications;

    return (
        <>
            <Heading className={Margins.bottom8}>{t("notif.style")}</Heading>
            {settings.useNative !== "never" && Notification?.permission === "denied" && (
                <ErrorCard style={{ padding: "1em" }} className={Margins.bottom8}>
                    <Heading className={Margins.bottom8}>{t("notif.denied.title")}</Heading>
                    <Paragraph>{t("notif.denied.desc")}</Paragraph>
                </ErrorCard>
            )}
            <Paragraph className={Margins.bottom8}>
                {t("notif.styles.intro")}
                <ul>
                    <li><strong>{t("notif.styles.halo")}</strong> : {t("notif.styles.haloDesc")}</li>
                    <li><strong>{t("notif.styles.desktop")}</strong> : {t("notif.styles.desktopDesc")}</li>
                </ul>
            </Paragraph>
            <Select
                placeholder={t("notif.style")}
                options={[
                    { label: t("notif.style.notFocused"), value: "not-focused", default: true },
                    { label: t("notif.style.always"), value: "always" },
                    { label: t("notif.style.never"), value: "never" },
                ] satisfies Array<{ value: typeof settings["useNative"]; } & Record<string, any>>}
                closeOnSelect={true}
                select={v => settings.useNative = v}
                isSelected={v => v === settings.useNative}
                serialize={identity}
            />

            <Heading className={Margins.top16 + " " + Margins.bottom8}>{t("notif.position")}</Heading>
            <Select
                isDisabled={settings.useNative === "always"}
                placeholder={t("notif.position")}
                options={[
                    { label: t("notif.position.bottomRight"), value: "bottom-right", default: true },
                    { label: t("notif.position.topRight"), value: "top-right" },
                ] satisfies Array<{ value: typeof settings["position"]; } & Record<string, any>>}
                select={v => settings.position = v}
                isSelected={v => v === settings.position}
                serialize={identity}
            />

            <Heading className={Margins.top16 + " " + Margins.bottom8}>{t("notif.timeout")}</Heading>
            <Paragraph className={Margins.bottom16}>{t("notif.timeout.desc")}</Paragraph>
            <Slider
                disabled={settings.useNative === "always"}
                markers={[0, 1000, 2500, 5000, 10_000, 20_000]}
                minValue={0}
                maxValue={20_000}
                initialValue={settings.timeout}
                onValueChange={v => settings.timeout = v}
                onValueRender={v => (v / 1000).toFixed(2) + "s"}
                onMarkerRender={v => (v / 1000) + "s"}
                stickToMarkers={false}
            />

            <Heading className={Margins.top16 + " " + Margins.bottom8}>{t("notif.logLimit")}</Heading>
            <Paragraph className={Margins.bottom16}>{t("notif.logLimit.desc")}            </Paragraph>
            <Slider
                markers={[0, 25, 50, 75, 100, 200]}
                minValue={0}
                maxValue={200}
                stickToMarkers={true}
                initialValue={settings.logLimit}
                onValueChange={v => settings.logLimit = v}
                onValueRender={v => v === 200 ? "∞" : v}
                onMarkerRender={v => v === 200 ? "∞" : v}
            />
        </>
    );
}
