# ◯ Halo

**Plugins, thèmes et optimisations de performances pour Discord**, intégrés directement dans les paramètres de Discord.

> [!WARNING]
> **Modifier le client Discord est contraire aux [conditions d'utilisation de Discord](https://discord.com/terms).** Les sanctions sont rares pour un usage cosmétique, mais le risque existe et il est à votre charge. Certains plugins sont plus risqués que d'autres : voir [docs/CONDITIONS-UTILISATION.md](docs/CONDITIONS-UTILISATION.md).

## Installation

1. Téléchargez **`HaloInstaller.exe`** depuis les [Releases](https://github.com/MaTows02/Halo/releases/latest).
2. Lancez-le, cochez vos installations de Discord, puis cliquez sur **Installer / Réparer**.
3. Dans Discord : *Paramètres utilisateur → Halo*.

L'installateur pèse moins de 1 Mo, ne demande pas les droits administrateur et ne modifie jamais le fichier d'origine de Discord. Il sert aussi à désinstaller.

## Fonctionnalités

- **Section Halo dans les paramètres de Discord** : accueil, plugins, thèmes, mises à jour, cloud, sauvegarde.
- **Plus de 170 plugins** activables d'un clic, avec réglages, favoris, filtres et recherche.
- **Tout en français** : interface, descriptions et réglages des plugins. La langue suit celle de Discord, ou se choisit dans *Halo → Langue* (français, anglais).
- **Thèmes** : thèmes locaux (`.theme.css`), thèmes en ligne et QuickCSS avec éditeur.
- **Performances** : profils, moniteur RAM / CPU / GPU, vidage de la RAM en un clic ou automatique, options du moteur.
- **Cloud** : synchronisation des réglages entre vos PC, sur un serveur que vous hébergez (fourni).
- **Interface aux couleurs de Discord**, qui suit le thème actif.

### Plugins Halo

| Plugin | Rôle |
|---|---|
| **HaloPerformance** | Profils *Origine / Équilibré / Économie / Personnalisé*, moniteur RAM, CPU et GPU par processus, bouton **Libérer la mémoire**, vidage automatique en arrière-plan, pause des GIF quand Discord est caché, options du moteur Chromium. |
| **HaloConfidentialite** | Floute avatars, pseudos, messages et médias jusqu'au survol. Bouton dans la barre de message et `Ctrl+Alt+B`. |
| **HaloBlocNotes** | Bloc-notes personnel dans une fenêtre Discord (`Ctrl+Alt+N`). Les notes restent sur le PC. |

## Documentation

| Document | Contenu |
|---|---|
| [docs/GUIDE.md](docs/GUIDE.md) | Guide complet : installation, plugins, thèmes, sauvegarde, mises à jour, dépannage. |
| [docs/PERFORMANCE.md](docs/PERFORMANCE.md) | Fonctionnement du moniteur RAM / CPU / GPU, du vidage de la RAM, des profils et des options du moteur. |
| [docs/CLOUD.md](docs/CLOUD.md) | Fonctionnement du cloud et hébergement du serveur. |
| [docs/CONDITIONS-UTILISATION.md](docs/CONDITIONS-UTILISATION.md) | Risques vis-à-vis des règles de Discord, par type de plugin. |

## Développement

Prérequis : Windows, [Node.js 22+](https://nodejs.org) et pnpm (`npm i -g pnpm`, ou `npx pnpm@12.15.0` à la place de `pnpm`).

```bash
pnpm install
pnpm build --dev
pnpm inject
```

`pnpm inject` branche Discord directement sur le dossier `dist/` du dépôt : après chaque `pnpm build --dev` (ou avec `pnpm watch`), faites `Ctrl+R` dans Discord. `pnpm uninject` remet Discord d'origine.

| Commande | Rôle |
|---|---|
| `pnpm build --dev` | Compile Halo dans `dist/`. |
| `pnpm buildInstaller` | Compile la version de publication et `dist/HaloInstaller.exe`. |
| `pnpm test:ts` | Vérifie les types. |
| `pnpm lint` | Vérifie le style et les en-têtes de licence. |

### Organisation du dépôt

| Dossier | Contenu |
|---|---|
| `src/plugins/` | Les plugins (un dossier par plugin). Les plugins propres à Halo commencent par `halo`. |
| `src/components/settings/` | L'interface de Halo dans les paramètres de Discord. |
| `src/utils/i18n/` | Les traductions. |
| `src/main/` | Le code exécuté dans le processus principal de Discord. |
| `installer/` | L'installateur graphique (C#, WPF). |
| `cloud/` | Le serveur de synchronisation Halo Cloud. |
| `docs/` | La documentation. |

### Installateur

`installer/HaloInstaller.cs` est une application WPF compilée avec le compilateur C# livré avec Windows : aucun SDK à installer. Les fichiers de Halo sont embarqués dans l'exe. Il accepte aussi `--install`, `--uninstall` et `--status` (avec `--log fichier`) pour un usage sans fenêtre.

### Traductions

Les textes se trouvent dans `src/utils/i18n/` :

- `en.ts` et `fr.ts` : l'interface de Halo (TypeScript signale toute clé manquante) ;
- `plugins.fr.ts` : descriptions, réglages et listes de choix des plugins ;
- `index.ts` et `plugins.ts` : choix de la langue et fonctions de traduction.

Pour ajouter une langue, copiez `fr.ts` et `plugins.fr.ts`, traduisez-les, puis déclarez-les dans `index.ts` (`HaloLanguages`, `dictionaries`) et `plugins.ts` (`dictionaries`).

### Créer un plugin

Les plugins publics vont dans `src/plugins`, les plugins privés dans `src/userplugins` (non versionnés). Voir [.skills/authoring-plugins.md](.skills/authoring-plugins.md) et les plugins `halo*` comme exemples. Le code Node.js (accès au système) va dans un fichier `native.ts` à côté du plugin.

### Publier une version

Le système de mise à jour compare l'identifiant du commit compilé au dernier mot du titre de la dernière *Release*.

```bash
git commit -am "Halo 1.0.1"
git push
pnpm buildInstaller
git rev-parse --short HEAD        # identifiant à mettre à la fin du titre
```

Créez ensuite une *Release* nommée `Halo 1.0.1 <identifiant>` et joignez-y `dist/HaloInstaller.exe`, `dist/patcher.js`, `dist/preload.js`, `dist/renderer.js` et `dist/renderer.css`.

## Licence

Halo est distribué sous licence **GPL-3.0-or-later** ([LICENSE](LICENSE)).

Une partie du code provient de Vencord (© Vendicated et contributeurs, GPL-3.0-or-later) et a été modifiée pour Halo. Les fichiers concernés conservent leur en-tête de licence d'origine, comme l'exige la GPL. Les fichiers propres à Halo portent *Copyright (c) 2026 Halo contributors*.

Halo n'est ni affilié à Discord Inc., ni approuvé par elle.
