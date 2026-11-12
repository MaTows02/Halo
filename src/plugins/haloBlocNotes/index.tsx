/*
 * Halo, a Discord client mod
 * Copyright (c) 2026 Halo contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ChatBarButton, ChatBarButtonFactory } from "@api/ChatButtons";
import * as DataStore from "@api/DataStore";
import { RenderModalProps } from "@prisme/discord-types";
import { Devs } from "@utils/constants";
import { t } from "@utils/i18n";
import definePlugin, { IconComponent } from "@utils/types";
import { Modal, openModal, React, TextArea, useEffect, useState } from "@webpack/common";

const STORE_KEY = "HaloBlocNotes";
let saveTimer: ReturnType<typeof setTimeout> | undefined;

function NotesModal({ modalProps }: { modalProps: RenderModalProps; }) {
    const [text, setText] = useState<string | null>(null);

    useEffect(() => {
        DataStore.get<string>(STORE_KEY).then(saved => setText(saved ?? ""));
    }, []);

    function update(value: string) {
        setText(value);
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => DataStore.set(STORE_KEY, value), 400);
    }

    function close() {
        clearTimeout(saveTimer);
        if (text != null) DataStore.set(STORE_KEY, text);
        modalProps.onClose();
    }

    return (
        <Modal
            {...modalProps}
            onClose={close}
            title={t("notes.title")}
            subtitle={t("notes.subtitle")}
            actions={[{ text: t("common.close"), variant: "primary", onClick: close }]}
        >
            <TextArea
                value={text ?? ""}
                onChange={update}
                placeholder={t(text == null ? "notes.loading" : "notes.placeholder")}
                rows={14}
                autoFocus
            />
        </Modal>
    );
}

export const openNotes = () => openModal(props => <NotesModal modalProps={props} />);

const NotesIcon: IconComponent = ({ height = 20, width = 20, className }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" className={className}>
        <path fill="currentColor" d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5L14 3.5ZM7 12v2h10v-2H7Zm0 4v2h7v-2H7Z" />
    </svg>
);

const NotesButton: ChatBarButtonFactory = ({ isMainChat }) => {
    if (!isMainChat) return null;
    return (
        <ChatBarButton tooltip={t("notes.tooltip")} onClick={openNotes}>
            <NotesIcon />
        </ChatBarButton>
    );
};

function onKeyDown(e: KeyboardEvent) {
    if (e.getModifierState("AltGraph")) return;
    if (e.ctrlKey && e.altKey && !e.shiftKey && e.code === "KeyN") {
        e.preventDefault();
        openNotes();
    }
}

export default definePlugin({
    name: "HaloBlocNotes",
    description: "A personal notepad, from the message box or with Ctrl+Alt+N",
    tags: ["Utility", "Chat"],
    authors: [Devs.Halo],

    chatBarButton: {
        icon: NotesIcon,
        render: NotesButton
    },

    start() {
        document.addEventListener("keydown", onKeyDown, true);
    },

    stop() {
        document.removeEventListener("keydown", onKeyDown, true);
    }
});
