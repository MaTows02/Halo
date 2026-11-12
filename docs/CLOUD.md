# Halo Cloud : synchroniser ses réglages

## À quoi ça sert

Le cloud de Halo garde une copie de vos réglages sur un serveur pour les retrouver sur tous vos PC : plugins activés, réglages des plugins, QuickCSS et liens de thèmes.

Ce n'est pas obligatoire. Sans cloud, vous pouvez déplacer vos réglages à la main avec *Paramètres → Halo → Sauvegarde et restauration*.

**Halo n'a pas de serveur par défaut.** Tant que vous n'avez pas renseigné l'adresse d'un serveur, rien n'est envoyé nulle part. Le serveur est un petit programme fourni avec Halo (`cloud/server.mjs`), que vous hébergez vous-même ou qu'une personne de confiance héberge pour vous.

## Comment ça fonctionne

```
   Votre PC (Halo dans Discord)                    Votre serveur (Halo Cloud)
   ----------------------------                    --------------------------
1. « Activer les intégrations cloud »   ───────►   donne l'identifiant de l'application Discord
2. Fenêtre Discord « Autoriser »        ───────►   Discord confirme qui vous êtes (votre identifiant)
3.                                      ◄───────   le serveur vous donne un secret
4. « Envoyer les réglages »             ───────►   réglages compressés, rangés à votre identifiant
5. Sur un autre PC : « Télécharger »    ◄───────   réglages renvoyés si le secret est le bon
```

En détail :

1. **Connexion.** Halo ouvre la fenêtre d'autorisation officielle de Discord. Le serveur ne reçoit que votre identifiant Discord (un nombre). Il ne reçoit ni votre mot de passe, ni votre jeton, ni vos messages.
2. **Secret.** Le serveur crée un secret aléatoire pour vous et le renvoie à Halo, qui le garde sur votre PC. Chaque requête suivante est signée avec ce secret. Sur un autre PC, la même connexion Discord redonne le même secret.
3. **Envoi.** Halo compresse vos réglages et les envoie. Le serveur les enregistre avec la date d'envoi.
4. **Téléchargement.** Halo envoie la date de sa dernière synchronisation. Si le serveur n'a rien de plus récent, il répond « rien de nouveau » et rien n'est téléchargé.

### Les règles de synchronisation

Dans *Paramètres → Halo → Cloud*, une fois connecté :

| Règle | Comportement |
|---|---|
| Synchronisation dans les deux sens | Chaque modification est envoyée, et les réglages plus récents du serveur sont téléchargés au démarrage. |
| Cet appareil fait référence | Ce PC envoie, mais ne télécharge jamais. |
| Le serveur fait référence | Ce PC télécharge, mais n'envoie jamais. |
| Pas de synchronisation automatique | Rien ne bouge sans les boutons « Envoyer » et « Télécharger ». |

## Ce qui est stocké sur le serveur

Pour chaque utilisateur, dans le dossier `data/` du serveur :

| Fichier | Contenu |
|---|---|
| `<identifiant Discord>.json` | Le secret et la date du dernier envoi. |
| `<identifiant Discord>.bin` | Les réglages compressés. |

Les réglages sont compressés, **pas chiffrés** : la personne qui administre le serveur peut les lire. Ils contiennent vos réglages de plugins, donc éventuellement des clés d'API que vous y avez saisies (traduction, musique…). N'utilisez qu'un serveur que vous contrôlez ou auquel vous faites confiance.

Vous pouvez tout effacer depuis Halo : « Supprimer les réglages du serveur » ou « Supprimer mon compte cloud ».

## Héberger le serveur

Il faut une machine joignable depuis Internet (un petit VPS suffit), **Node.js 20 ou plus récent**, et une adresse en **HTTPS** : Discord refuse les connexions non sécurisées.

### 1. Créer l'application Discord

Elle sert uniquement à la fenêtre « Autoriser ».

1. Allez sur https://discord.com/developers/applications et cliquez sur **New Application**. Donnez-lui un nom, par exemple « Halo Cloud ».
2. Dans **OAuth2**, copiez le **Client ID** et générez un **Client Secret** (gardez-le privé).
3. Dans **OAuth2 → Redirects**, ajoutez l'adresse de retour : `https://cloud.exemple.fr/v1/oauth/callback` (remplacez par votre adresse).

### 2. Lancer le serveur

Copiez `cloud/server.mjs` sur la machine, puis :

```bash
DISCORD_CLIENT_ID=123456789012345678 \
DISCORD_CLIENT_SECRET=votre_client_secret \
PUBLIC_URL=https://cloud.exemple.fr \
PORT=8080 \
node server.mjs
```

| Variable | Rôle |
|---|---|
| `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` | Identifiants de l'application Discord. |
| `PUBLIC_URL` | Adresse publique du serveur, en HTTPS, sans barre finale. |
| `PORT` | Port d'écoute local (8080 par défaut). |
| `DATA_DIR` | Dossier des données (`./data` par défaut). Pensez à le sauvegarder. |
| `ALLOWED_USERS` | Facultatif : identifiants Discord autorisés, séparés par des virgules. Sans cette variable, tout compte Discord peut utiliser votre serveur. |
| `SIZE_LIMIT` | Taille maximale des réglages, en octets (32 Mo par défaut). |

Le serveur écoute en HTTP sur le port choisi. Placez un proxy devant lui pour le HTTPS. Avec [Caddy](https://caddyserver.com), deux lignes suffisent, et le certificat est créé automatiquement :

```
cloud.exemple.fr {
    reverse_proxy 127.0.0.1:8080
}
```

Vérifiez que tout répond : ouvrez `https://cloud.exemple.fr/v1/oauth/settings` dans un navigateur. Vous devez voir votre Client ID et l'adresse de retour.

### 3. Brancher Halo dessus

1. *Paramètres → Halo → Cloud* : saisissez l'adresse dans **Adresse du serveur** (`https://cloud.exemple.fr/`).
2. Activez **Activer les intégrations cloud**. Halo demande l'autorisation de contacter ce domaine, puis propose de redémarrer Discord.
3. Après le redémarrage, réactivez l'option : la fenêtre « Autoriser » de Discord s'ouvre. Validez.
4. Activez **Activer la synchronisation**, puis cliquez sur **Envoyer les réglages**.
5. Sur vos autres PC : même adresse, même autorisation, puis **Télécharger les réglages**.

## Référence de l'API

Le serveur répond à ces requêtes. L'en-tête `Authorization` vaut `base64("secret:identifiantDiscord")`.

| Requête | Authentifiée | Réponse |
|---|---|---|
| `GET /v1/oauth/settings` | non | `{ clientId, redirectUri }` |
| `GET /v1/oauth/callback?code=…` | non | `{ secret }` après vérification du code auprès de Discord |
| `GET /v1/settings` | oui | Réglages compressés et en-tête `ETag` (date d'envoi). `304` si l'en-tête `If-None-Match` correspond, `404` s'il n'y a rien. |
| `PUT /v1/settings` | oui | Enregistre le corps de la requête. Répond `{ written }`. |
| `DELETE /v1/settings` | oui | Supprime les réglages. |
| `DELETE /v1/` | oui | Supprime les réglages et le compte. |

## Questions fréquentes

**Est-ce que mes messages ou mon compte passent par le serveur ?** Non. Seuls votre identifiant Discord et vos réglages Halo y sont envoyés.

**Que se passe-t-il si le serveur est éteint ?** Halo affiche une notification d'erreur de synchronisation et continue de fonctionner avec les réglages locaux.

**Puis-je changer de serveur ?** Oui : changez l'adresse. Halo se déconnecte de l'ancien serveur et vous redemande l'autorisation pour le nouveau.
