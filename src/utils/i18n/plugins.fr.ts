/*
 * Halo, a Discord client mod
 * Copyright (c) 2026 Halo contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { PluginTranslations } from "./plugins";

// d : description du plugin, s : description de chaque réglage (par clé),
// o : libellés des listes déroulantes (libellé anglais → libellé français)
const fr: PluginTranslations = {
    tags: {
        Accessibility: "Accessibilité",
        Activity: "Activité",
        Appearance: "Apparence",
        Chat: "Chat",
        Commands: "Commandes",
        Console: "Console",
        Customisation: "Personnalisation",
        Developers: "Développeurs",
        Emotes: "Émojis",
        Friends: "Amis",
        Fun: "Fun",
        Media: "Médias",
        Notifications: "Notifications",
        Organisation: "Organisation",
        Privacy: "Confidentialité",
        Reactions: "Réactions",
        Roles: "Rôles",
        Servers: "Serveurs",
        Shortcuts: "Raccourcis",
        Utility: "Utilitaires",
        Voice: "Vocal"
    },
    plugins: {
        AccountPanelServerProfile: {
            d: "Clic droit sur votre panneau de compte (en bas à gauche) pour voir votre profil dans le serveur actuel",
            s: { prioritizeServerProfile: "Ouvrir en priorité le profil de serveur au clic gauche sur le panneau de compte" }
        },
        AddAttachments: { d: "Permet d'ajouter des pièces jointes en modifiant un message" },
        AlwaysAnimate: { d: "Anime tout ce qui peut être animé" },
        AlwaysExpandRoles: { d: "Affiche toujours la liste complète des rôles dans les profils" },
        AlwaysTrust: {
            d: "Supprime les avertissements de domaine non fiable et de fichier suspect",
            s: {
                domain: "Supprimer l'avertissement de domaine non fiable à l'ouverture d'un lien",
                file: "Supprimer l'avertissement « téléchargement potentiellement dangereux »"
            }
        },
        AnonymiseFileNames: {
            d: "Anonymise le nom des fichiers envoyés",
            s: {
                anonymiseByDefault: "Anonymiser les noms de fichiers par défaut",
                method: "Méthode d'anonymisation",
                randomisedLength: "Nombre de caractères aléatoires",
                consistent: "Nom de fichier fixe"
            },
            o: { "Random Characters": "Caractères aléatoires", Consistent: "Nom fixe", Timestamp: "Horodatage" }
        },
        AutoDNDWhilePlaying: {
            d: "Change automatiquement votre statut (en ligne, inactif, ne pas déranger) au lancement d'un jeu",
            s: { statusToSet: "Statut à appliquer pendant un jeu" },
            o: { Online: "En ligne", Idle: "Inactif", "Do Not Disturb": "Ne pas déranger", Invisible: "Invisible" }
        },
        BadgeAPI: { d: "API permettant d'ajouter des badges aux utilisateurs" },
        BetterFolders: {
            d: "Affiche les dossiers de serveurs dans une barre latérale dédiée et améliore leur gestion",
            s: {
                sidebar: "Afficher les serveurs du dossier dans une barre latérale dédiée",
                sidebarAnim: "Animer l'ouverture de la barre latérale des dossiers",
                closeAllFolders: "Fermer tous les dossiers en sélectionnant un serveur hors dossier",
                closeAllHomeButton: "Fermer tous les dossiers en cliquant sur le bouton d'accueil",
                closeOthers: "Fermer les autres dossiers à l'ouverture d'un dossier",
                closeServerFolder: "Fermer le dossier en sélectionnant un serveur qu'il contient",
                forceOpen: "Ouvrir le dossier en passant à l'un de ses serveurs",
                keepIcons: "Garder les icônes des serveurs dans le dossier de la barre principale quand il est ouvert dans la barre latérale",
                showFolderIcon: "Afficher l'icône du dossier au-dessus de ses serveurs dans la barre latérale"
            },
            o: { Never: "Jamais", Always: "Toujours", "When more than one folder is expanded": "Quand plusieurs dossiers sont ouverts" }
        },
        BetterGifAltText: { d: "Remplace le texte alternatif « GIF » par les mots-clés ou le nom de fichier du GIF" },
        BetterGifPicker: { d: "Ouvre le sélecteur de GIF sur la catégorie Favoris par défaut" },
        BetterRoleContext: {
            d: "Ajoute au clic droit sur un rôle (profil ou liste des membres) : copier la couleur, modifier le rôle, voir son icône",
            s: { roleIconFileFormat: "Format de fichier pour afficher les icônes de rôle" }
        },
        BetterRoleDot: {
            d: "Copie la couleur du rôle en cliquant sur la pastille de rôle (option d'accessibilité). Permet aussi d'utiliser à la fois la pastille et les pseudos colorés",
            s: {
                bothStyles: "Afficher à la fois la pastille de rôle et les pseudos colorés",
                copyRoleColorInProfilePopout: "Copier la couleur du rôle en cliquant sur la pastille dans les profils"
            }
        },
        BetterSearch: { d: "Débloque des options de recherche de messages dans un salon normalement indisponibles" },
        BetterSessions: {
            d: "Améliore le menu des sessions (appareils) : dates exactes, nom personnalisé pour chaque session et notifications en cas de nouvelle session.",
            s: {
                backgroundCheck: "Vérifier les nouvelles sessions en arrière-plan et afficher une notification",
                checkInterval: "Fréquence de vérification en arrière-plan, en minutes"
            }
        },
        BetterSettings: {
            d: "Améliore l'ouverture du menu des paramètres",
            s: {
                disableFade: "Désactiver l'animation de fondu",
                organizeMenu: "Organiser par catégories le menu contextuel de la roue dentée",
                eagerLoad: "Supprimer le délai de chargement à la première ouverture du menu"
            }
        },
        BetterUploadButton: { d: "Envoi de fichier en un clic, menu au clic droit" },
        BiggerStreamPreview: { d: "Permet d'agrandir les aperçus de stream" },
        BlurNSFW: {
            d: "Floute les pièces jointes des salons NSFW jusqu'au survol",
            s: {
                blurAmount: "Intensité du flou (en pixels)",
                ignoredChannels: "ID des salons à ne pas flouter, séparés par un espace ou une virgule"
            }
        },
        CallTimer: {
            d: "Ajoute un chronomètre aux appels vocaux",
            s: { format: "Format du chronomètre (tout format moment.js valide)" }
        },
        CharacterCounter: {
            d: "Ajoute un compteur de caractères à la zone de saisie",
            s: { colorEffects: "Colorer en jaune puis en rouge à l'approche de la limite" }
        },
        ChatInputButtonAPI: { d: "API permettant d'ajouter des boutons à la zone de saisie" },
        ClearURLs: { d: "Retire automatiquement les éléments de pistage des liens que vous envoyez" },
        ClientTheme: { d: "Recrée l'ancienne expérience de thème client : ajoutez une couleur au thème de Discord" },
        ColorSighted: { d: "Retire les icônes pour daltoniens des statuts, comme sur le Discord de 2015-2017" },
        CommandsAPI: { d: "API requise par tout ce qui utilise des commandes" },
        ConcatenatedComponentExtractor: { d: "Extrait les composants fusionnés par l'empaqueteur de Discord" },
        ConsoleJanitor: {
            d: "Désactive les messages et erreurs inutiles de la console",
            s: {
                disableLoggers: "Désactiver les journaux de Discord",
                disableSpotifyLogger: "Désactiver le journal Spotify, qui expose des informations de compte et le jeton d'accès",
                whitelistedLoggers: "Journaux à garder même si les autres sont masqués, séparés par des points-virgules (;)"
            }
        },
        ConsoleShortcuts: { d: "Ajoute des raccourcis dans la console pour de nombreux objets. Tapez `shortcutList` pour en voir la liste." },
        ContextMenuAPI: { d: "API permettant d'ajouter ou de retirer des éléments des menus contextuels." },
        CopyEmojiMarkdown: {
            d: "Permet de copier un émoji sous sa forme texte (<:blobcatcozy:1026533070955872337>)",
            s: { copyUnicode: "Copier le caractère unicode au lieu de :nom: pour les émojis par défaut (👽)" }
        },
        CopyFileContents: { d: "Ajoute un bouton pour copier le contenu des fichiers texte joints" },
        CopyUserURLs: { d: "Ajoute « Copier l'URL de l'utilisateur » au menu contextuel des utilisateurs." },
        CrashHandler: {
            d: "Gère les plantages de Discord et tente de les récupérer sans redémarrage",
            s: {
                attemptToPreventCrashes: "Tenter d'empêcher les plantages de Discord.",
                attemptToNavigateToHome: "Tenter de revenir à l'accueil lorsqu'un plantage est évité."
            }
        },
        CustomCommands: { d: "Permet de créer vos propres commandes slash / tags" },
        CustomIdle: {
            d: "Permet de régler le délai avant le passage en inactif (ou de le désactiver)",
            s: {
                idleTimeout: "Minutes avant de passer en inactif (0 pour désactiver)",
                remainInIdle: "À votre retour sur Discord, rester inactif jusqu'à confirmation"
            }
        },
        CustomRPC: {
            d: "Ajoute une Rich Presence (statut de jeu) entièrement personnalisable à votre profil",
            s: { enablePresence: "Afficher la présence" }
        },
        Dearrow: {
            d: "Rend les titres et miniatures des vidéos YouTube intégrées moins racoleurs, grâce à Dearrow",
            s: {
                hideButton: "Masquer le bouton Dearrow des intégrations YouTube",
                replaceElements: "Éléments de l'intégration à remplacer",
                dearrowByDefault: "Appliquer Dearrow automatiquement"
            },
            o: { "Everything (Titles & Thumbnails)": "Tout (titres et miniatures)", Titles: "Titres", Thumbnails: "Miniatures" }
        },
        Decor: {
            d: "Créez et utilisez vos propres décorations d'avatar, ou choisissez parmi les modèles.",
            s: { agreedToGuidelines: "Règles acceptées" }
        },
        DevCompanion: {
            d: "Plugin compagnon pour les développeurs",
            s: { notifyOnAutoConnect: "Notifier quand le compagnon se connecte automatiquement." }
        },
        DirectFileDownload: { d: "Télécharge directement les fichiers de Discord au lieu de les ouvrir dans le navigateur" },
        DisableCallIdle: { d: "Empêche d'être expulsé d'un appel privé après 3 minutes ou déplacé dans un salon AFK." },
        DisableDeepLinks: { d: "Désactive les liens profonds de Discord, qui tentent de forcer l'ouverture de l'application de bureau" },
        DontRoundMyTimestamps: { d: "Arrondit toujours les durées relatives vers le bas : 7,6 ans devient 7 ans et non 8" },
        DynamicImageModalAPI: { d: "Permet d'omettre la largeur ou la hauteur à l'ouverture d'une image" },
        Experiments: { d: "Donne accès aux expériences et autres fonctions réservées aux développeurs de Discord" },
        ExpressionManager: {
            d: "Clonez émojis et autocollants. Ajoute des options au clic droit pour les cloner, modifier ou supprimer, ainsi que Copier et Enregistrer pour les autocollants",
            s: {
                editAndDelete: "Ajouter « Modifier » et « Supprimer » au menu contextuel du sélecteur d'expressions",
                stickerCopyAndOpen: "Ajouter « Copier le lien » et « Ouvrir le lien » au menu contextuel des autocollants",
                recents: "Ajouter « Retirer des récents » au menu contextuel des expressions fréquentes"
            }
        },
        F8Break: { d: "Met le client en pause avec F8 quand les outils de développement sont ouverts (points d'arrêt)." },
        FakeProfileThemes: {
            d: "Permet de thématiser son profil en cachant les couleurs dans la bio grâce à l'encodage invisible 3y3",
            s: { nitroFirst: "Source de couleurs par défaut si les deux existent" },
            o: { "Nitro colors": "Couleurs Nitro", "Fake colors": "Couleurs de la bio" }
        },
        FavoriteEmojiFirst: { d: "Place vos émojis favoris en premier dans l'autocomplétion." },
        FixCodeblockGap: { d: "Supprime l'espace entre un bloc de code et le texte qui suit" },
        FixDiscordCss: { d: "Corrige les ralentissements dus au CSS de Discord" },
        FixImagesQuality: {
            d: "Améliore la qualité des images en les chargeant dans leur résolution d'origine",
            s: { originalImagesInChat: "Charger aussi l'image d'origine dans le chat. ATTENTION : lisez les mises en garde ci-dessus" }
        },
        FixSpotifyEmbeds: {
            d: "Corrige le volume excessif des intégrations Spotify en permettant de le régler",
            s: { volume: "Volume (%) des intégrations Spotify. Au-delà de 10 %, c'est très fort" }
        },
        FixYoutubeEmbeds: { d: "Contourne le blocage de l'affichage de certaines vidéos YouTube dans Discord (par exemple par UMG)" },
        ForceOwnerCrown: { d: "Affiche toujours la couronne du propriétaire à côté de son pseudo, même sur les gros serveurs." },
        FriendInvites: { d: "Créez et gérez des liens d'invitation d'ami avec des commandes slash (/create friend invite, /view friend invites, /revoke friend invites)." },
        FullSearchContext: { d: "Donne toutes les options attendues au menu contextuel des messages dans les résultats de recherche" },
        GameActivityToggle: {
            d: "Ajoute un bouton près du micro et du casque pour activer ou non l'activité de jeu. Clic droit pour l'activité Spotify.",
            s: {
                oldIcon: "Utiliser l'ancien style d'icône",
                location: "Emplacement du bouton d'activité de jeu"
            },
            o: { "Next to Mute/Deafen": "À côté de Muet / Sourdine", "Halo Toolbox": "Boîte à outils Halo" }
        },
        GifPaste: { d: "Choisir un GIF insère son lien dans la zone de saisie au lieu de l'envoyer directement" },
        GifProviderSwitcher: {
            d: "Permet d'utiliser la recherche de GIF Tenor ou Giphy à la place de Klipy",
            s: { provider: "Fournisseur à utiliser. Modifiable aussi directement dans le sélecteur de GIF" }
        },
        GreetStickerPicker: {
            d: "Permet de choisir n'importe quel autocollant de bienvenue par un clic droit sur le bouton « Fais coucou ! »",
            s: { greetMode: "Mode de salutation" },
            o: {
                "Greet (you can only greet 3 times)": "Salutation (3 fois maximum)",
                "Normal Message (you can greet spam)": "Message normal (sans limite)"
            }
        },
        HaloBlocNotes: { d: "Un bloc-notes personnel, depuis la barre de message ou avec Ctrl+Alt+N" },
        HaloConfidentialite: { d: "Floute avatars, pseudos, messages et médias jusqu'au survol, pour partager son écran ou streamer sereinement (Ctrl+Alt+B)" },
        HaloPerformance: { d: "Profils de performance, moniteur RAM/CPU/GPU et libération de la mémoire pour alléger Discord" },
        HideMedia: { d: "Masque les pièces jointes et intégrations d'un message grâce à un bouton au survol" },
        IgnoreActivities: {
            d: "Empêche certaines activités d'apparaître dans votre statut UNIQUEMENT. Choisissez lesquelles dans les onglets Jeux enregistrés et Activités, ou avec les réglages généraux ci-dessous",
            s: {
                listMode: "Mode de la liste de filtrage",
                ignorePlaying: "Ignorer toutes les activités « Joue à » (en général les jeux et les RPC)",
                ignoreStreaming: "Ignorer toutes les activités de stream",
                ignoreListening: "Ignorer toutes les activités « Écoute » (en général Spotify)",
                ignoreWatching: "Ignorer toutes les activités « Regarde »",
                ignoreCompeting: "Ignorer toutes les activités « Participe à » (certaines activités de jeu)"
            },
            o: { Whitelist: "Liste blanche", Blacklist: "Liste noire" }
        },
        iLoveSpam: { d: "Ne masque plus les messages des « spammeurs probables »" },
        ImageFilename: {
            d: "Affiche le nom de fichier des images et GIF dans une infobulle au survol",
            s: { showFullUrl: "Afficher l'URL complète de l'image au lieu du seul nom de fichier. Toujours actif pour les GIF, dont le nom est rarement parlant" }
        },
        ImageLink: { d: "Ne masque jamais les liens d'images dans les messages, même s'ils en sont le seul contenu" },
        ImageZoom: {
            d: "Permet de zoomer dans les images et les GIF. Molette pour zoomer, Maj + molette pour changer la taille de la loupe",
            s: {
                saveZoomValues: "Mémoriser le zoom et la taille de la loupe",
                invertScroll: "Inverser le sens de la molette",
                nearestNeighbour: "Utiliser l'interpolation au plus proche voisin pour agrandir les images",
                square: "Loupe carrée",
                zoom: "Zoom de la loupe",
                size: "Taille de la loupe",
                zoomSpeed: "Vitesse de changement du zoom et de la taille"
            }
        },
        ImplicitRelationships: {
            d: "Affiche vos relations implicites dans l'onglet Amis.",
            s: { sortByAffinity: "Trier les relations implicites par affinité avec vous." }
        },
        IrcColors: {
            d: "Donne à chaque pseudo une couleur unique dans le chat, comme dans les clients IRC",
            s: {
                lightness: "Luminosité, en %. À ajuster si les couleurs sont trop claires ou trop sombres",
                saturation: "Saturation, en %. À ajuster si les couleurs sont trop vives ou trop ternes",
                seed: "Changer cette valeur redistribue une nouvelle couleur à chaque pseudo",
                memberListColors: "Remplacer les couleurs de rôle dans la liste des membres",
                applyColorOnlyToUsersWithoutColor: "N'appliquer les couleurs qu'aux utilisateurs sans couleur définie",
                applyColorOnlyInDms: "N'appliquer les couleurs que dans les messages privés, pas dans les serveurs."
            }
        },
        JumpToTop: { d: "Ajoute un bouton pour aller au premier message d'un salon" },
        KeepCurrentChannel: { d: "Tente de revenir au salon où vous étiez après un changement de compte ou au lancement de Discord." },
        LoadingQuotes: {
            d: "Remplace les citations de chargement de Discord",
            s: {
                replaceEvents: "Appliquer aussi pendant les événements aux citations spéciales (ex. Halloween)",
                enablePluginPresetQuotes: "Activer les citations fournies par ce plugin",
                enableDiscordPresetQuotes: "Activer les citations de Discord (y compris celles des événements)",
                additionalQuotes: "Citations personnalisées supplémentaires, séparées par le délimiteur ci-dessous",
                additionalQuotesDelimiter: "Délimiteur des citations supplémentaires"
            }
        },
        MemberCount: {
            d: "Affiche le nombre de membres en ligne, le total et les utilisateurs en vocal, dans la liste des membres et l'infobulle du serveur.",
            s: {
                toolTip: "Afficher le nombre de membres dans l'infobulle du serveur",
                memberList: "Afficher le nombre de membres dans la liste des membres",
                voiceActivity: "Afficher l'activité vocale avec le nombre de membres"
            }
        },
        MemberListDecoratorsAPI: { d: "API permettant d'ajouter des décorations à la liste des membres (serveurs et MP)" },
        MentionAvatars: {
            d: "Affiche les avatars et les icônes de rôle dans les mentions",
            s: { showAtSymbol: "Afficher le symbole @ dans les mentions d'utilisateur" }
        },
        MessageAccessoriesAPI: { d: "API permettant d'ajouter des accessoires aux messages." },
        MessageClickActions: {
            d: "Maintenez Retour arrière et cliquez pour supprimer, double-cliquez pour modifier ou répondre",
            s: {
                enableDeleteOnClick: "Supprimer au clic en maintenant Retour arrière",
                enableDoubleClickToEdit: "Double-clic pour modifier",
                enableDoubleClickToReply: "Double-clic pour répondre",
                requireModifier: "N'agir au double-clic que si Maj ou Ctrl est maintenu"
            }
        },
        MessageDecorationsAPI: { d: "API permettant d'ajouter des décorations aux messages" },
        MessageEventsAPI: { d: "API requise par tout ce qui utilise les événements de message." },
        MessageLatency: {
            d: "Affiche un indicateur sur les messages qui ont mis au moins n secondes à s'envoyer",
            s: {
                latency: "Seuil de l'indicateur de latence, en secondes",
                detectDiscordKotlin: "Détecter les anciens clients Discord Android",
                showMillis: "Afficher les millisecondes",
                ignoreSelf: "Ne pas ajouter d'indicateur à vos propres messages"
            }
        },
        MessageLinkEmbeds: {
            d: "Ajoute un aperçu aux messages qui contiennent un lien vers un autre message",
            s: {
                messageBackgroundColor: "Couleur de fond des messages dans les intégrations riches",
                automodEmbeds: "Utiliser les intégrations de type AutoMod au lieu des intégrations riches (plus petites, moins d'informations)",
                listMode: "Utiliser la liste d'ID comme liste noire ou liste blanche",
                idList: "ID de serveurs, salons ou utilisateurs à filtrer (séparés par des virgules)"
            },
            o: {
                "Always use automod embeds": "Toujours utiliser les intégrations AutoMod",
                "Prefer automod embeds, but use rich embeds if some content can't be shown": "Préférer les intégrations AutoMod, sauf si du contenu ne peut pas être affiché",
                "Never use automod embeds": "Ne jamais utiliser les intégrations AutoMod",
                Blacklist: "Liste noire",
                Whitelist: "Liste blanche"
            }
        },
        MessageLogger: {
            d: "Conserve temporairement les messages supprimés et modifiés.",
            s: {
                deleteStyle: "Style des messages supprimés",
                logDeletes: "Conserver les messages supprimés",
                collapseDeleted: "Replier les messages supprimés, comme les messages bloqués",
                logEdits: "Conserver les messages modifiés",
                logDeletedAttachments: "Conserver les pièces jointes supprimées",
                inlineEdits: "Afficher l'historique des modifications dans le contenu du message",
                ignoreBots: "Ignorer les messages des bots",
                ignoreSelf: "Ignorer vos propres messages",
                ignoreUsers: "ID d'utilisateurs à ignorer, séparés par des virgules",
                ignoreChannels: "ID de salons à ignorer, séparés par des virgules",
                ignoreGuilds: "ID de serveurs à ignorer, séparés par des virgules"
            },
            o: { "Red text": "Texte rouge", "Red overlay": "Fond rouge" }
        },
        MessagePopoverAPI: { d: "API permettant d'ajouter des boutons au menu flottant des messages." },
        MessageUpdaterAPI: { d: "API permettant de mettre à jour et de réafficher les messages." },
        MoreQuickReactions: {
            d: "Augmente le nombre de réactions rapides disponibles au survol d'un message",
            s: { reactionCount: "Nombre de réactions (0-42)" }
        },
        MusicRichPresence: {
            d: "Rich Presence pour Last.FM / ListenBrainz",
            s: {
                scrobblerBackend: "Service de scrobbling à utiliser.",
                instanceBaseURL: "Adresse de votre instance ListenBrainz.",
                instanceAPIBaseUrl: "Adresse de l'API de votre instance ListenBrainz.",
                apiKey: "Clé API Last.fm. Facultative, mais fortement conseillée pour éviter les limites de la clé partagée",
                username: "Nom d'utilisateur",
                shareUsername: "Afficher un lien vers le profil du service",
                clickableLinks: "Rendre cliquables les noms de titre, d'artiste et d'album",
                hideWithSpotify: "Masquer la présence si Spotify est lancé",
                hideWithActivity: "Masquer la présence si vous avez une autre activité",
                statusName: "Texte de statut personnalisé. Variables disponibles : {artist} | {album} | {title}",
                statusDisplayType: "Afficher le titre ou l'artiste dans la liste des membres",
                nameFormat: "Afficher le titre et l'artiste dans le nom du statut",
                useListeningStatus: "Afficher « Écoute » au lieu de « Joue à »",
                missingArt: "Si l'album ou sa pochette est introuvable",
                showLogo: "Afficher le logo du service à côté de la pochette",
                showAlbumCover: "Afficher la pochette de l'album. Sinon, une image neutre est affichée (utile si vos pochettes sont inappropriées)"
            },
            o: {
                "ListenBrainz Compatible (self-hosted)": "Compatible ListenBrainz (auto-hébergé)",
                "Don't show (shows generic listening message)": "Ne pas afficher (message d'écoute générique)",
                "Show artist name": "Afficher l'artiste",
                "Show track name": "Afficher le titre",
                "Use custom status name": "Utiliser le texte de statut personnalisé",
                "Use music service name (falls back to custom status text)": "Utiliser le nom du service de musique (sinon le texte personnalisé)",
                "Use format 'artist - song'": "Format « artiste - titre »",
                "Use format 'song - artist'": "Format « titre - artiste »",
                "Use artist name only": "Artiste uniquement",
                "Use song name only": "Titre uniquement",
                "Use album name (falls back to custom status text if song has no album)": "Nom de l'album (sinon le texte personnalisé)",
                "Use large scrobbler logo": "Utiliser le grand logo du service",
                "Use generic placeholder": "Utiliser une image neutre"
            }
        },
        MutedServersActivityBadge: { d: "Garde le badge d'activité des serveurs visible même quand le serveur est en sourdine." },
        MutualGroupDMs: { d: "Affiche les groupes privés en commun dans les profils" },
        NewGuildSettings: {
            d: "Met automatiquement en sourdine les nouveaux serveurs et applique d'autres réglages à l'arrivée",
            s: {
                guild: "Mettre le serveur en sourdine automatiquement",
                messages: "Notifications du serveur",
                everyone: "Supprimer @everyone et @here",
                role: "Supprimer toutes les mentions de rôle",
                highlights: "Désactiver les temps forts automatiquement",
                events: "Mettre les nouveaux événements en sourdine automatiquement",
                showAllChannels: "Afficher tous les salons automatiquement"
            },
            o: { "All messages": "Tous les messages", "Only @mentions": "Seulement les @mentions", Nothing: "Rien", "Server default": "Réglage par défaut du serveur" }
        },
        NoBlockedMessages: {
            d: "Masque complètement du chat les messages des utilisateurs bloqués ou ignorés",
            s: {
                ignoreMessages: "Ignorer entièrement les messages entrants des utilisateurs bloqués (et ignorés, si l'option est active)",
                applyToIgnoredUsers: "Appliquer aussi aux utilisateurs « ignorés »"
            }
        },
        NoDevtoolsWarning: { d: "Désactive la bannière « HOLD UP » de la console. Effet secondaire : Discord ne masque plus votre jeton, ce qui évite des déconnexions aléatoires." },
        NoF1: { d: "Désactive le raccourci d'aide F1." },
        NoMaskedUrlPaste: { d: "Coller un lien avec du texte sélectionné ne crée plus de lien masqué" },
        NoMiddleClickPaste: { d: "Désactive le collage au clic du milieu (Linux uniquement)" },
        NoMosaic: {
            d: "Supprime la mosaïque d'images de Discord",
            s: { inlineVideo: "Lire les vidéos sans ouvrir le carrousel" }
        },
        NoOnboardingDelay: { d: "Supprime le délai lent et pénible de l'accueil des nouveaux membres" },
        NoPendingCount: {
            d: "Retire le compteur des demandes d'ami, des demandes de message et des offres Nitro.",
            s: {
                hideFriendRequestsCount: "Masquer le compteur des demandes d'ami",
                hideMessageRequestsCount: "Masquer le compteur des demandes de message",
                hidePremiumOffersCount: "Masquer le compteur des offres Nitro"
            }
        },
        NoProfileThemes: { d: "Retire complètement les thèmes de profil Nitro de tout le monde sauf vous" },
        NoReplyMention: {
            d: "Désactive par défaut la mention dans les réponses",
            s: {
                userList: "ID d'utilisateurs à mentionner ou à exempter (séparés par des virgules ou des espaces)",
                roleList: "ID de rôles à mentionner ou à exempter (séparés par des virgules ou des espaces)",
                shouldPingListed: "Comportement",
                inverseShiftReply: "Inverser le comportement de Maj + réponse de Discord (Maj + réponse mentionne alors l'utilisateur)"
            },
            o: {
                "Do not ping the listed users / roles": "Ne pas mentionner les utilisateurs / rôles listés",
                "Only ping the listed users / roles": "Mentionner uniquement les utilisateurs / rôles listés"
            }
        },
        NoServerEmojis: {
            d: "N'affiche pas les émojis de serveur dans l'autocomplétion.",
            s: { shownEmojis: "Types d'émojis à afficher dans l'autocomplétion." },
            o: {
                "Only unicode emojis": "Émojis unicode uniquement",
                "Unicode emojis and server emojis from current server": "Émojis unicode et émojis du serveur actuel",
                "Unicode emojis and all server emojis (Discord default)": "Émojis unicode et tous les émojis de serveur (défaut Discord)"
            }
        },
        NoSystemBadge: { d: "Désactive le compteur de non-lus sur la barre des tâches et la zone de notification." },
        NoticesAPI: { d: "Corrige la fermeture automatique des bandeaux d'information" },
        NotificationVolume: {
            d: "Ménagez vos oreilles : réglez un volume distinct pour les notifications et les sons de l'application",
            s: { notificationVolume: "Volume des notifications" }
        },
        NoTrack: {
            d: "Désactive le pistage de Discord (statistiques), les métriques et les rapports de plantage Sentry",
            s: {
                disableAnalytics: "Bloquer les statistiques de pistage de Discord",
                allowBadgeTracking: "Envoyer quand même les événements nécessaires à la progression des badges (ex. heures de jeu, heures de stream)"
            }
        },
        NoTypingAnimation: { d: "Désactive l'animation des points « en train d'écrire », gourmande en CPU" },
        NoUnblockToJump: { d: "Permet d'aller aux messages des utilisateurs bloqués, ignorés ou spammeurs probables sans les débloquer" },
        oneko: { d: "Un chat qui suit votre souris (pour de vrai)" },
        OnePingPerDM: {
            d: "Si quelqu'un vous envoie plusieurs messages privés non lus, vous n'entendez qu'une seule notification. Lisez les messages pour réinitialiser",
            s: {
                channelToAffect: "Type de messages privés concernés",
                allowMentions: "Garder le son pour les @mentions",
                allowEveryone: "Garder le son pour @everyone et @here dans les groupes privés"
            },
            o: { Both: "Les deux", "User DMs": "Messages privés", "Group DMs": "Groupes privés" }
        },
        OpenInApp: { d: "Ouvre les liens dans leur application plutôt que dans le navigateur" },
        OverrideForumDefaults: {
            d: "Permet de changer la présentation et le tri par défaut des forums. Chaque salon reste réglable individuellement",
            s: {
                defaultLayout: "Présentation par défaut",
                defaultSortOrder: "Tri par défaut"
            },
            o: { List: "Liste", Gallery: "Galerie", "Recently Active": "Activité récente", "Date Posted": "Date de publication" }
        },
        PauseInvitesForever: { d: "Rétablit l'option de suspendre les invitations indéfiniment, retirée par Discord." },
        PermissionFreeWill: {
            d: "Désactive les restrictions côté client dans la gestion des permissions de salon.",
            s: {
                lockout: "Contourner la protection contre le verrouillage (« Tu ne veux sûrement pas faire ça »)",
                onboarding: "Contourner les exigences de l'accueil (« Cette modification rendra ton serveur incompatible […] »)"
            }
        },
        PermissionsViewer: {
            d: "Affiche les permissions d'un utilisateur ou d'un salon, et les rôles d'un serveur",
            s: { permissionsSortOrder: "Méthode de tri pour déterminer quel rôle accorde une permission" },
            o: { "Highest Role": "Rôle le plus élevé", "Lowest Role": "Rôle le plus bas" }
        },
        petpet: { d: "Ajoute la commande /petpet pour créer un GIF de caresse à partir de n'importe quelle image" },
        PictureInPicture: {
            d: "Ajoute l'image dans l'image aux vidéos (à côté du bouton Télécharger)",
            s: { loop: "Lire la vidéo en boucle en mode image dans l'image" }
        },
        PinDMs: {
            d: "Permet d'épingler des conversations privées en haut de la liste. Clic droit sur une conversation pour épingler, désépingler ou réordonner",
            s: {
                pinOrder: "Ordre d'affichage des conversations épinglées",
                canCollapseDmSection: "Permettre de replier la section des conversations non classées",
                dmSectionCollapsed: "Replier la section des conversations privées"
            },
            o: { "Most recent message": "Message le plus récent", "Custom (right click channels to reorder)": "Personnalisé (clic droit pour réordonner)" }
        },
        PlainFolderIcon: { d: "N'affiche plus les petites icônes de serveur dans les dossiers" },
        PlatformIndicators: {
            d: "Ajoute des indicateurs de plateforme (bureau, mobile, web…) aux utilisateurs",
            s: { colorMobileIndicator: "Donner à l'indicateur mobile la couleur du statut de l'utilisateur." }
        },
        PreviewMessage: { d: "Permet de prévisualiser votre message avant de l'envoyer." },
        HaloToolbox: {
            d: "Ajoute à la barre de titre un bouton regroupant les actions rapides de Halo",
            s: { showPluginMenu: "Afficher le menu des plugins dans la boîte à outils" }
        },
        QuickMention: { d: "Ajoute un bouton de mention rapide à la barre d'actions des messages" },
        QuickReply: {
            d: "Répondez (Ctrl + haut/bas) et modifiez (Ctrl + Maj + haut/bas) des messages au clavier",
            s: {
                shouldMention: "Mentionner dans la réponse par défaut",
                ignoreBlockedAndIgnored: "Ignorer les messages des utilisateurs bloqués ou ignorés pendant la navigation"
            },
            o: { "Follow NoReplyMention plugin (if enabled)": "Suivre le plugin NoReplyMention (s'il est activé)", Enabled: "Activé", Disabled: "Désactivé" }
        },
        ReactErrorDecoder: { d: "Remplace « Minified React Error » par l'erreur réelle." },
        ReadAllNotificationsButton: { d: "Marquez toutes les notifications de serveur comme lues en un seul clic" },
        RelationshipNotifier: {
            d: "Vous prévient quand un ami, un groupe privé ou un serveur vous retire.",
            s: {
                notices: "Afficher aussi un bandeau en haut de l'écran (pour ne manquer aucune notification).",
                offlineRemovals: "Prévenir au lancement de Discord si vous avez été retiré pendant que vous étiez hors ligne.",
                friends: "Prévenir quand un ami vous retire",
                friendRequestCancels: "Prévenir quand une demande d'ami est annulée",
                servers: "Prévenir quand vous êtes retiré d'un serveur",
                groups: "Prévenir quand vous êtes retiré d'un groupe privé"
            }
        },
        ReplaceGoogleSearch: {
            d: "Remplace la recherche Google par d'autres moteurs",
            s: {
                customEngineName: "Nom du moteur de recherche personnalisé",
                customEngineURL: "URL de votre moteur de recherche",
                replacementEngine: "Remplacer par un moteur précis au lieu d'ajouter un menu"
            },
            o: { Off: "Désactivé", "Custom Engine": "Moteur personnalisé" }
        },
        ReplyTimestamp: { d: "Affiche la date dans l'aperçu des messages auxquels on répond" },
        RevealAllSpoilers: { d: "Révèle tous les spoilers d'un message avec Ctrl + clic sur un spoiler, ou tous ceux du chat avec Ctrl + Maj + clic" },
        ReverseImageSearch: { d: "Ajoute la recherche d'image inversée au menu contextuel des images" },
        ReviewDB: {
            d: "Rédigez des avis sur d'autres utilisateurs (ajoute une section aux profils)",
            s: {
                notifyReviews: "Notifier les nouveaux avis au démarrage",
                showWarning: "Afficher un rappel de respect en haut de la liste des avis",
                hideTimestamps: "Masquer la date des avis",
                hideBlockedUsers: "Masquer les avis des utilisateurs bloqués"
            }
        },
        RoleColorEverywhere: {
            d: "Applique la couleur du rôle le plus élevé partout où c'est possible",
            s: {
                chatMentions: "Couleurs de rôle dans les mentions du chat (y compris dans la zone de saisie)",
                memberList: "Couleurs de rôle dans les en-têtes de la liste des membres",
                voiceUsers: "Couleurs de rôle dans la liste des utilisateurs en vocal",
                reactorsList: "Couleurs de rôle dans la liste des réactions",
                pollResults: "Couleurs de rôle dans les résultats de sondage",
                colorChatMessages: "Colorer les messages selon la couleur de rôle de leur auteur",
                messageSaturation: "Intensité de la coloration des messages."
            }
        },
        SecretRingToneEnabler: {
            d: "Joue toujours la version secrète de la sonnerie de Discord (sauf pendant les événements à sonnerie spéciale)",
            s: { onlySnow: "Ne jouer que le thème Snow Halation" }
        },
        SendTimestamps: {
            d: "Envoyez facilement des dates dynamiques grâce au bouton de la zone de saisie et à des raccourcis texte. Lisez la description détaillée !",
            s: { replaceMessageContents: "Remplacer les dates dans le contenu des messages" }
        },
        ServerInfo: { d: "Permet d'afficher les informations d'un serveur" },
        ServerListAPI: { d: "API requise par les plugins qui modifient la liste des serveurs" },
        ServerListIndicators: {
            d: "Ajoute le nombre d'amis en ligne ou de serveurs dans la liste des serveurs",
            s: { mode: "Mode" },
            o: {
                "Only online friend count": "Nombre d'amis en ligne uniquement",
                "Only server count": "Nombre de serveurs uniquement",
                "Both server and online friend counts": "Nombre de serveurs et d'amis en ligne"
            }
        },
        Settings: {
            d: "Ajoute l'interface des paramètres et les informations de débogage",
            s: {
                settingsLocation: "Emplacement de la section Halo dans les paramètres",
                includePrismeInfoWhenCopying: "Copier aussi les informations de Halo (Halo, Electron, Chromium) en cliquant sur les informations de version, en bas à gauche des paramètres"
            },
            o: {
                "At the very top": "Tout en haut",
                "Above the Nitro section": "Au-dessus de la section Nitro",
                "Below the Nitro section": "En dessous de la section Nitro",
                "Above Activity Settings": "Au-dessus des paramètres d'activité",
                "Below Activity Settings": "En dessous des paramètres d'activité",
                "At the very bottom": "Tout en bas"
            }
        },
        ShikiCodeblocks: {
            d: "Apporte à Discord des blocs de code façon VS Code, grâce à Shiki",
            s: {
                theme: "Thèmes par défaut",
                customTheme: "Lien vers un thème VS Code personnalisé",
                tryDiscordHighlighter: "Utiliser la coloration syntaxique de Discord, plus légère.",
                useDevIcon: "Affichage des icônes de langage sur les blocs de code",
                bgOpacity: "Opacité du fond"
            },
            o: {
                Never: "Jamais",
                "Prefer Shiki instead of Discord's highlighter": "Préférer Shiki à la coloration de Discord",
                "Prefer Discord's highlighter instead of Shiki": "Préférer la coloration de Discord à Shiki",
                Always: "Toujours",
                Disabled: "Désactivées",
                Colorless: "Sans couleur",
                Colored: "En couleur"
            }
        },
        ShowAllMessageButtons: { d: "Affiche toujours tous les boutons des messages, que la touche Maj soit maintenue ou non." },
        ShowConnections: {
            d: "Affiche les comptes connectés dans les profils et le panneau latéral des MP",
            s: { iconSize: "Taille des icônes (px)", iconSpacing: "Espacement des icônes" },
            o: { Compact: "Compact", Cozy: "Confortable", Roomy: "Aéré" }
        },
        ShowHiddenChannels: {
            d: "Affiche les salons auxquels vous n'avez pas accès.",
            s: {
                hideUnreads: "Masquer les non-lus",
                showMode: "Style d'affichage des salons cachés.",
                defaultAllowedUsersAndRolesDropdownState: "Ouvrir par défaut la liste des utilisateurs et rôles autorisés des salons cachés"
            },
            o: {
                "Plain style with Lock Icon instead": "Style normal avec une icône de cadenas",
                "Muted style with hidden eye icon on the right": "Style atténué avec une icône d'œil barré à droite"
            }
        },
        ShowHiddenThings: { d: "Affiche divers éléments cachés ou réservés aux modérateurs, quelles que soient vos permissions." },
        ShowMeYourName: {
            d: "Affiche le nom d'utilisateur à côté du surnom, ou sans surnom du tout",
            s: {
                mode: "Affichage des noms d'utilisateur et des surnoms",
                friendNicknames: "Priorité entre surnoms d'ami et surnoms de serveur",
                displayNames: "Utiliser les noms d'affichage à la place des noms d'utilisateur",
                inReplies: "Appliquer aussi aux aperçus de réponse"
            },
            o: {
                "Username then nickname": "Nom d'utilisateur puis surnom",
                "Nickname then username": "Surnom puis nom d'utilisateur",
                "Username only": "Nom d'utilisateur uniquement",
                "Nickname only": "Surnom uniquement",
                "Show friend nicknames only in direct messages": "Surnoms d'ami uniquement en messages privés",
                "Prefer friend nicknames over server nicknames": "Préférer les surnoms d'ami aux surnoms de serveur",
                "Prefer server nicknames over friend nicknames": "Préférer les surnoms de serveur aux surnoms d'ami"
            }
        },
        ShowTimeoutDuration: {
            d: "Affiche la durée restante de l'exclusion temporaire d'un utilisateur, dans l'infobulle de l'icône ou à côté",
            s: { displayStyle: "Affichage de la durée d'exclusion" },
            o: { "In the Tooltip": "Dans l'infobulle", "Next to the timeout icon": "À côté de l'icône d'exclusion" }
        },
        SilentMessageToggle: {
            d: "Ajoute à la barre de message un bouton pour envoyer un message silencieux.",
            s: {
                persistState: "Conserver l'état du bouton en changeant de salon",
                autoDisable: "Désactiver automatiquement le mode silencieux après un envoi"
            }
        },
        SilentTyping: {
            d: "Masque le fait que vous êtes en train d'écrire",
            s: {
                showIcon: "Afficher une icône pour activer ou désactiver le plugin",
                contextMenu: "Ajouter l'option au menu contextuel de la zone de saisie",
                isEnabled: "Activer la fonction",
                showTypingIn: "ID des salons où toujours montrer que vous écrivez, séparés par des virgules"
            }
        },
        SortFriendRequests: {
            d: "Trie les demandes d'ami par date de réception",
            s: { showDates: "Afficher la date des demandes d'ami" }
        },
        SpotifyControls: {
            d: "Ajoute un lecteur Spotify au-dessus du panneau de compte",
            s: {
                hoverControls: "Afficher les commandes au survol",
                useSpotifyUris: "Ouvrir les URI Spotify au lieu des liens web. Nécessite Spotify installé et peut ne pas fonctionner partout",
                previousButtonRestartsTrack: "Le bouton Précédent relance le titre en cours après plus de 3 s de lecture"
            }
        },
        SpotifyShareCommands: { d: "Partagez le titre, l'album ou l'artiste Spotify en cours avec une commande slash (/track, /album, /artist)" },
        StartupTimings: { d: "Ajoute les temps de démarrage au menu des paramètres" },
        StickerPaste: { d: "Choisir un autocollant l'insère dans la zone de saisie au lieu de l'envoyer directement" },
        StreamerModeOnStream: { d: "Active automatiquement le mode streamer quand vous lancez un stream dans Discord" },
        SuperReactionTweaks: {
            d: "Réglez la limite de super-réactions animées en même temps et utilisez-les par défaut",
            s: {
                superReactByDefault: "Le sélecteur de réactions propose les super-réactions par défaut",
                unlimitedSuperReactionPlaying: "Supprimer la limite de super-réactions animées en même temps",
                superReactionPlayingLimit: "Nombre maximal de super-réactions animées en même temps. 0 pour ne plus les animer"
            }
        },
        TextReplace: {
            d: "Remplace du texte dans vos messages selon vos propres règles",
            s: {
                stringRules: "Règles de remplacement par correspondance de texte.",
                regexRules: "Règles de remplacement par expressions régulières."
            }
        },
        ThemeAttributes: { d: "Ajoute des attributs de données à divers éléments, utiles aux créateurs de thèmes" },
        Translate: {
            d: "Traduit les messages avec Google Traduction, DeepL ou Kagi.",
            s: {
                receivedInput: "Langue d'origine des messages reçus",
                receivedOutput: "Langue de traduction des messages reçus",
                sentInput: "Langue d'origine de vos messages",
                sentOutput: "Langue de traduction de vos messages",
                deeplApiKey: "Votre clé API DeepL (depuis deepl.com/your-account)",
                kagiSession: "Votre jeton de session Kagi (depuis kagi.com/settings?p=user_details)",
                autoTranslate: "Traduire automatiquement vos messages avant l'envoi. Maj + clic ou clic droit sur le bouton de traduction pour basculer",
                showAutoTranslateTooltip: "Afficher une infobulle sur le bouton de la barre de message quand un message est traduit automatiquement"
            },
            o: {
                "Google Translate": "Google Traduction",
                "DeepL Free — API key required": "DeepL Free (clé API requise)",
                "DeepL Pro — API key required": "DeepL Pro (clé API requise)",
                "Kagi Translate — API key required": "Kagi Translate (clé API requise)"
            }
        },
        TypingIndicator: {
            d: "Ajoute un indicateur quand quelqu'un écrit dans un salon.",
            s: {
                includeCurrentChannel: "Afficher l'indicateur pour le salon actuellement ouvert",
                includeMutedChannels: "Afficher l'indicateur pour les salons en sourdine.",
                includeIgnoredUsers: "Afficher l'indicateur pour les utilisateurs ignorés.",
                includeBlockedUsers: "Afficher l'indicateur pour les utilisateurs bloqués.",
                indicatorMode: "Apparence de l'indicateur"
            },
            o: { "Avatars and animated dots": "Avatars et points animés", "Animated dots": "Points animés", Avatars: "Avatars" }
        },
        TypingTweaks: {
            d: "Affiche les avatars et les couleurs de rôle dans l'indicateur « en train d'écrire »",
            s: {
                showAvatars: "Afficher les avatars dans l'indicateur",
                showRoleColors: "Afficher les couleurs de rôle dans l'indicateur",
                alternativeFormatting: "Afficher un message plus utile quand plusieurs personnes écrivent"
            }
        },
        Unindent: { d: "Retire l'indentation superflue au début des blocs de code" },
        UnlockedAvatarZoom: {
            d: "Permet de zoomer davantage dans l'outil de recadrage lors du changement d'avatar",
            s: { zoomMultiplier: "Multiplicateur de zoom" }
        },
        UnsuppressEmbeds: { d: "Permet de réafficher les intégrations masquées d'un message" },
        UserMessagesPronouns: {
            d: "Ajoute les pronoms à côté des messages des utilisateurs",
            s: {
                pronounsFormat: "Format d'affichage des pronoms dans le chat",
                showSelf: "Afficher vos propres pronoms"
            },
            o: { Lowercase: "Minuscules", Capitalized: "Majuscule initiale" }
        },
        UserSettingsAPI: { d: "Modifie les UserSettings de Discord pour exposer leur groupe et leur nom." },
        UserVoiceShow: {
            d: "Affiche un indicateur quand un utilisateur est dans un salon vocal",
            s: {
                showInUserProfileModal: "Afficher l'indicateur dans le profil, à côté du nom",
                showInMemberList: "Afficher l'indicateur dans la liste des membres et des MP",
                showInMessages: "Afficher l'indicateur dans les messages"
            }
        },
        USRBG: {
            d: "Affiche les bannières USRBG, qui permettent d'avoir une bannière sans Nitro",
            s: {
                nitroFirst: "Bannière à utiliser si les deux existent",
                voiceBackground: "Utiliser les bannières USRBG comme arrière-plan en vocal"
            },
            o: { "Nitro banner": "Bannière Nitro", "USRBG banner": "Bannière USRBG" }
        },
        ValidReply: { d: "Corrige « Impossible de charger le message » au survol d'une réponse" },
        ValidUser: { d: "Corrige les mentions d'utilisateurs inconnus affichées « @unknown-user » (survolez la mention pour la corriger)" },
        VcNarrator: {
            d: "Annonce à voix haute les arrivées, départs et déplacements dans les salons vocaux",
            s: {
                volume: "Volume du narrateur",
                rate: "Vitesse du narrateur",
                sayOwnName: "Prononcer votre propre nom",
                latinOnly: "Retirer les caractères non latins des noms avant de les prononcer",
                joinMessage: "Message d'arrivée",
                leaveMessage: "Message de départ",
                moveMessage: "Message de déplacement",
                muteMessage: "Message de mise en muet (vous uniquement pour l'instant)",
                unmuteMessage: "Message de fin de muet (vous uniquement pour l'instant)",
                deafenMessage: "Message de mise en sourdine (vous uniquement pour l'instant)",
                undeafenMessage: "Message de fin de sourdine (vous uniquement pour l'instant)"
            }
        },
        ViewIcons: {
            d: "Rend cliquables les avatars et bannières des profils, et ajoute « Voir l'icône / la bannière / la décoration d'avatar » aux menus contextuels des utilisateurs, serveurs et groupes.",
            s: {
                format: "Format des images non animées. Les images animées utilisent toujours .webp",
                imgSize: "Taille d'image à utiliser"
            }
        },
        ViewRaw: {
            d: "Copiez et affichez le contenu ou les données brutes d'un message, d'un salon ou d'un serveur",
            s: {
                clickMethod: "Type de clic sur le bouton pour afficher le contenu brut d'un message.",
                messageContextMenu: "Afficher dans le menu contextuel des messages",
                sortKeys: "Trier les clés des données brutes par ordre alphabétique.",
                stripSensitiveData: "Retirer des données brutes les informations sensibles, comme votre e-mail et votre numéro de téléphone."
            },
            o: {
                "Left Click to view the raw content.": "Clic gauche pour voir le contenu brut.",
                "Right click to view the raw content.": "Clic droit pour voir le contenu brut."
            }
        },
        VoiceChatDoubleClick: { d: "Rejoignez les salons vocaux par un double-clic au lieu d'un simple clic" },
        VoiceDownload: { d: "Ajoute un bouton de téléchargement aux messages vocaux (ouvre un onglet du navigateur)" },
        VoiceMessages: {
            d: "Permet d'envoyer des messages vocaux comme sur mobile : clic droit sur le bouton d'envoi de fichier, puis « Envoyer un message vocal »",
            s: { noiseSuppression: "Réduction de bruit", echoCancellation: "Annulation de l'écho" }
        },
        VolumeBooster: {
            d: "Permet de monter le volume des utilisateurs et des streams au-delà du maximum par défaut",
            s: { multiplier: "Multiplicateur de volume" }
        },
        WebContextMenus: {
            d: "Rétablit les menus contextuels absents de la version web de Discord : liens et images (copier, ouvrir), zone de texte (copier, couper, coller, correcteur)",
            s: { addBack: "Rétablir les menus contextuels de Discord pour les images, les liens et la zone de saisie" }
        },
        WebKeybinds: {
            d: "Rétablit les raccourcis clavier absents de la version web de Discord. Ne fonctionne pleinement que sur Vesktop / Legcord, pas dans un navigateur",
            s: {
                showNavigationButtons: "Afficher les boutons Précédent / Suivant dans la barre de titre.",
                overrideCommonKeybinds: "Laisser Discord prendre la main sur les raccourcis d'onglets courants (Ctrl+T, Ctrl+Maj+T, Ctrl+Tab, Ctrl+Maj+Tab, Ctrl+N). Ne fonctionne que dans quelques navigateurs."
            }
        },
        WebPWA: { d: "Rend Discord installable comme application (PWA). Active les badges de notification, les raccourcis globaux et la barre de titre de Discord." },
        "WebRichPresence (arRPC)": { d: "Client arRPC pour activer la Rich Presence sur Discord Web (expérimental)" },
        WebScreenShare: {
            d: "Ajoute un menu d'options au partage d'écran : résolution, images par seconde, type de contenu et son du système.",
            s: {
                resolution: "Résolution",
                frameRate: "Images par seconde",
                contentHint: "Type de contenu",
                systemAudio: "Couper le son du système"
            }
        },
        WebScreenShareFixes: { d: "Supprime la limite de débit de 2500 kbps sur les clients Chromium et Vesktop, et corrige la hausse continue du CPU pendant un partage d'écran." },
        WhoReacted: {
            d: "Affiche les avatars des utilisateurs qui ont réagi à un message",
            s: { clickableAvatars: "Cliquer sur l'avatar d'un utilisateur ouvre son profil au lieu d'ajouter la réaction" }
        },
        XSOverlay: {
            d: "Transmet les notifications Discord à XSOverlay, pour les lire en réalité virtuelle",
            s: {
                webSocketPort: "Port WebSocket",
                preferUDP: "À activer avec une ancienne version de XSOverlay incapable de se connecter en WebSocket. Ignoré sur le web.",
                botNotifications: "Autoriser les notifications de bots",
                serverNotifications: "Autoriser les notifications de serveurs",
                dmNotifications: "Autoriser les notifications de messages privés",
                groupDmNotifications: "Autoriser les notifications de groupes privés",
                callNotifications: "Autoriser les notifications d'appel",
                pingColor: "Couleur des mentions d'utilisateur",
                channelPingColor: "Couleur des mentions de salon",
                soundPath: "Son de notification (default / warning / error)",
                timeout: "Durée des notifications (secondes)",
                lengthBasedTimeout: "Allonger la durée selon la longueur du message",
                opacity: "Opacité des notifications",
                volume: "Volume"
            }
        },
        YoutubeAdblock: { d: "Bloque les publicités des vidéos YouTube intégrées et de l'activité WatchTogether grâce à AdGuard" }
    }
};

export default fr;
