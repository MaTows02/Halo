/*
 * Halo, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Command } from "@prisme/discord-types";
export { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType } from "@prisme/discord-types/enums";

export interface PrismeCommand extends Command {
    isPrismeCommand?: boolean;
    rootCommand?: PrismeCommand;
}
