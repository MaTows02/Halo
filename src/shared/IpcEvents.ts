/*
 * Halo, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
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

export const enum IpcEvents {
    INIT_FILE_WATCHERS = "PrismeInitFileWatchers",

    OPEN_QUICKCSS = "PrismeOpenQuickCss",
    GET_QUICK_CSS = "PrismeGetQuickCss",
    SET_QUICK_CSS = "PrismeSetQuickCss",
    QUICK_CSS_UPDATE = "PrismeQuickCssUpdate",

    GET_SETTINGS = "PrismeGetSettings",
    SET_SETTINGS = "PrismeSetSettings",

    GET_THEMES_LIST = "PrismeGetThemesList",
    GET_THEME_DATA = "PrismeGetThemeData",
    GET_THEME_SYSTEM_VALUES = "PrismeGetThemeSystemValues",
    THEME_UPDATE = "PrismeThemeUpdate",

    OPEN_EXTERNAL = "PrismeOpenExternal",
    OPEN_THEMES_FOLDER = "PrismeOpenThemesFolder",
    OPEN_SETTINGS_FOLDER = "PrismeOpenSettingsFolder",

    GET_UPDATES = "PrismeGetUpdates",
    GET_REPO = "PrismeGetRepo",
    UPDATE = "PrismeUpdate",
    BUILD = "PrismeBuild",

    OPEN_MONACO_EDITOR = "PrismeOpenMonacoEditor",
    GET_MONACO_THEME = "PrismeGetMonacoTheme",

    GET_PLUGIN_IPC_METHOD_MAP = "PrismeGetPluginIpcMethodMap",

    CSP_IS_DOMAIN_ALLOWED = "PrismeCspIsDomainAllowed",
    CSP_REMOVE_OVERRIDE = "PrismeCspRemoveOverride",
    CSP_REQUEST_ADD_OVERRIDE = "PrismeCspRequestAddOverride",

    GET_RENDERER_CSS = "PrismeGetRendererCss",
    RENDERER_CSS_UPDATE = "PrismeRendererCssUpdate",
    PRELOAD_GET_RENDERER_JS = "PrismePreloadGetRendererJs",

    SUPPORTS_WINDOWS_MATERIAL = "PrismeSupportsWindowsMaterial",
}
