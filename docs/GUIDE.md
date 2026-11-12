# Guide complet de Halo

Ce guide explique tout ce que fait Halo et comment s'en servir. Deux sujets ont leur propre page :

- [PERFORMANCE.md](PERFORMANCE.md) : profils, moniteur RAM / CPU / GPU, vidage de la RAM, options du moteur ;
- [CLOUD.md](CLOUD.md) : synchronisation des réglages entre appareils et hébergement du serveur.

## 1. Installer Halo

1. Téléchargez `HaloInstaller.exe` depuis la page [Releases](https://github.com/MaTows02/Halo/releases).
2. Lancez-le. Windows peut afficher « Windows a protégé votre ordinateur » car le programme n'est pas signé : cliquez sur *Informations complémentaires* puis *Exécuter quand même*.
3. L'installateur liste vos installations de Discord (Stable, PTB, Canary) avec leur état. Cochez celles que vous voulez, puis cliquez sur **Installer / Réparer**.
4. Discord est fermé, Halo est installé, puis Discord est relancé.

Ce que fait l'installateur, concrètement :

| Étape | Détail |
|---|---|
| Copie de Halo | 4 fichiers dans `%APPDATA%\Halo\dist` (`patcher.js`, `preload.js`, `renderer.js`, `renderer.css`). |
| Sauvegarde de Discord | Le fichier `app.asar` de Discord est renommé en `_app.asar`. Il n'est jamais modifié. |
| Relais | Un petit `app.asar` (moins de 1 Ko) est créé à la place. Il charge Halo, puis le vrai Discord. |

Si Halo est absent ou plante au chargement, le relais démarre Discord normalement. L'installateur refuse d'agir s'il ne retrouve pas le fichier d'origine de Discord, pour ne jamais l'écraser.

**Désinstaller** : relancez l'installateur et cliquez sur **Désinstaller**. Discord retrouve son fichier d'origine. Vos réglages restent dans `%APPDATA%\Halo` (supprimez ce dossier pour tout effacer).

**Après une mise à jour de Discord** : Halo se réinstalle tout seul sur la nouvelle version. Si ce n'est pas le cas, relancez l'installateur et cliquez sur **Installer / Réparer**.

## 2. Où trouver Halo dans Discord

Ouvrez les **Paramètres utilisateur** de Discord (la roue dentée en bas à gauche). Une section **Halo** apparaît dans la barre latérale :

| Onglet | Rôle |
|---|---|
| **Halo** | Accueil : langue, actions rapides, réglages généraux, notifications. |
| **Plugins** | Activer, désactiver et régler les plugins. |
| **Thèmes** | Thèmes locaux, thèmes en ligne, QuickCSS. |
| **Mises à jour** | Version installée et mise à jour de Halo. |
| **Cloud** | Synchronisation des réglages (voir [CLOUD.md](CLOUD.md)). |
| **Sauvegarde et restauration** | Export et import des réglages dans un fichier. |

## 3. Langue

Halo suit automatiquement la langue de Discord. Pour en forcer une autre : *Paramètres → Halo → Langue*. Le français et l'anglais sont disponibles. L'interface, les descriptions des plugins et leurs réglages sont traduits.

Pour ajouter une langue, voir la section « Traductions » du [README](../README.md).

## 4. Plugins

*Paramètres → Halo → Plugins*.

- **Activer un plugin** : cliquez sur son interrupteur. Certains plugins modifient le code de Discord et demandent un redémarrage : Halo vous le propose en quittant les paramètres.
- **Régler un plugin** : cliquez sur la roue dentée de sa carte. Une icône d'information signifie que le plugin n'a pas de réglage.
- **Retrouver un plugin** : barre de recherche, filtre par type (activés, favoris, nouveaux…) et par catégorie.
- **Favoris** : l'étoile dans la fenêtre d'un plugin le place en tête de liste.
- **Boutons des plugins** : « Gérer les boutons des plugins » permet de masquer les boutons que certains plugins ajoutent à la barre de message ou aux messages.

Un plugin désactivé ne coûte rien : son code n'est pas exécuté et Discord n'est pas modifié pour lui.

### Les plugins propres à Halo

| Plugin | Ce qu'il fait |
|---|---|
| **HaloPerformance** | Profils de performance, moniteur RAM / CPU / GPU, vidage de la RAM, options du moteur. Détails dans [PERFORMANCE.md](PERFORMANCE.md). |
| **HaloConfidentialite** | Floute avatars, pseudos, messages et médias jusqu'au survol de la souris. Bouton « œil » dans la barre de message, ou `Ctrl+Alt+B`. Pratique pour partager son écran. |
| **HaloBlocNotes** | Bloc-notes personnel dans une fenêtre Discord. Bouton dans la barre de message, ou `Ctrl+Alt+N`. Les notes sont enregistrées sur votre PC uniquement. |

### Plugins à risque

Tous les plugins ne se valent pas vis-à-vis des règles de Discord. Lisez [CONDITIONS-UTILISATION.md](CONDITIONS-UTILISATION.md) avant d'activer des plugins qui lisent des données cachées, agissent à votre place ou contournent des fonctions payantes.

## 5. Thèmes

*Paramètres → Halo → Thèmes*.

- **Mes thèmes** : placez un fichier `.theme.css` dans le dossier des thèmes (bouton « Dossier des thèmes »), puis activez-le. Les thèmes écrits pour BetterDiscord fonctionnent en général tels quels.
- **Thèmes en ligne** : collez l'adresse directe d'un fichier CSS (une par ligne). Préfixez une ligne par `@light` ou `@dark` pour qu'elle ne s'applique qu'au thème clair ou sombre.
- **QuickCSS** : un éditeur pour vos retouches personnelles, appliquées en direct (« Modifier le QuickCSS »).

Par sécurité, un thème ne peut charger des images, polices ou styles que depuis quelques sites connus (GitHub, Imgur, Google Fonts…). Si un thème en utilise d'autres, Halo affiche « Ressources bloquées » et vous laisse autoriser le domaine.

Un thème n'est pas gratuit pour les performances : voir la fin de [PERFORMANCE.md](PERFORMANCE.md).

## 6. Sauvegarder ses réglages

*Paramètres → Halo → Sauvegarde et restauration*.

- **Exporter** crée un fichier JSON qui contient vos réglages de plugins, votre QuickCSS et vos liens de thèmes.
- **Importer** remplace vos réglages actuels par ceux du fichier.

Pour une synchronisation automatique entre plusieurs PC, voir [CLOUD.md](CLOUD.md).

## 7. Mises à jour de Halo

*Paramètres → Halo → Mises à jour*.

Halo compare sa version à la dernière publication du dépôt [MaTows02/Halo](https://github.com/MaTows02/Halo). S'il existe une version plus récente, « Mettre à jour » télécharge les 4 fichiers de Halo depuis cette publication et les remplace dans `%APPDATA%\Halo\dist`. Un redémarrage de Discord applique la mise à jour.

Par défaut, la mise à jour est automatique au démarrage. Vous pouvez la désactiver dans cet onglet.

## 8. En cas de problème

| Problème | Solution |
|---|---|
| Discord ne s'ouvre plus (il reste en arrière-plan) | Réinstallez Discord depuis discord.com (votre compte et vos réglages sont conservés), puis relancez `HaloInstaller.exe`. |
| La section Halo a disparu | Relancez l'installateur → **Installer / Réparer**. |
| Discord est lent ou instable depuis l'activation d'un plugin | Désactivez les derniers plugins activés. En dernier recours, désinstallez Halo avec l'installateur : vos réglages sont conservés. |
| L'installateur affiche « Autre mod détecté » | Un autre mod de Discord est installé sur cette version. Désinstallez-le d'abord. |
| L'installateur affiche « Fichier d'origine manquant » | Réinstallez Discord depuis discord.com, puis relancez l'installateur. |
| Un thème ne s'affiche pas complètement | Regardez « Ressources bloquées » en haut de l'onglet Thèmes. |

## 9. Pour les développeurs

Voir le [README](../README.md) : compilation, mode développement, création de plugins, traductions, publication.
