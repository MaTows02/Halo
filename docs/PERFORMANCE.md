# Performances : comment ça marche

Tout se trouve dans le plugin **HaloPerformance** (*Paramètres → Halo → Plugins → HaloPerformance*, ou l'action rapide « Performance » de l'accueil). Activez-le, puis ouvrez ses réglages avec la roue dentée.

## 1. Pourquoi Discord consomme autant

Discord est une page web qui tourne dans son propre navigateur (Electron / Chromium). Il lance plusieurs processus :

| Processus | Rôle | Ce qui le fait grossir |
|---|---|---|
| **Principal** | Fenêtre, mises à jour, zone de notification | Peu de chose |
| **Interface** | La page de Discord : messages, images, serveurs | Le nombre de serveurs, les images, GIF et émojis déjà affichés, le temps passé ouvert |
| **GPU** | Affichage accéléré par la carte graphique | Les animations, les vidéos, la taille de la fenêtre |
| **Utilitaires** | Réseau, audio, vidéo | Les appels et les partages d'écran |

Plus Discord reste ouvert, plus le processus « Interface » garde d'éléments en mémoire. C'est lui que Halo cible.

## 2. Le moniteur

### RAM et CPU

Halo demande à Electron la liste des processus de Discord (`app.getAppMetrics()`). Pour chacun, il obtient :

- la **RAM** : la mémoire physique réellement occupée (la « plage de travail », la même valeur que dans le Gestionnaire des tâches) ;
- la mémoire **privée** : celle que le processus ne partage avec aucun autre ;
- le **CPU** : le pourcentage d'un cœur utilisé depuis la mesure précédente.

Le total affiché est la somme de tous les processus. La « mémoire JavaScript » est la mémoire utilisée par le code de la page (`performance.memory`).

Le moniteur se rafraîchit toutes les 2 secondes dans les réglages du plugin, et toutes les 3 secondes en surimpression (option « Afficher en permanence la RAM et le CPU »). Il se met en pause quand Discord est caché, pour ne rien coûter.

### GPU

Electron ne donne pas la charge de la carte graphique. Halo lit donc les **compteurs de performance de Windows**, ceux du Gestionnaire des tâches :

- **Mémoire vidéo (VRAM)** : la mémoire dédiée de la carte graphique utilisée par les processus de Discord ;
- **Charge du GPU** : le pourcentage d'utilisation de la carte graphique par Discord ;
- **Accélération matérielle** : indique si Discord dessine avec la carte graphique (réglage de Discord, dans *Paramètres → Avancés*).

Cette mesure lance un court script PowerShell (environ une seconde). Elle n'est donc faite qu'à l'ouverture des réglages et quand vous cliquez sur **Mesurer le GPU**, jamais en continu.

Sur un PC de test, Discord utilisait environ 1 Go de mémoire vidéo : c'est normal avec l'accélération matérielle, car chaque image affichée est stockée dans la carte graphique.

## 3. Vider la RAM

Le bouton **Libérer la mémoire** fait deux choses :

1. Il demande à Discord de vider les caches de son moteur de rendu (images décodées, polices, styles).
2. Il demande à Windows de retirer de la mémoire physique toutes les pages que les processus de Discord n'utilisent pas à l'instant (fonction `EmptyWorkingSet`, appliquée à chaque processus).

Mesure réelle sur un Discord ouvert depuis plusieurs heures :

| Moment | RAM de Discord |
|---|---|
| Avant | 2 847 Mo |
| Juste après | 27 Mo |
| 10 secondes plus tard, en utilisation | 320 Mo |

Ce qu'il faut savoir :

- La mémoire libérée devient disponible pour vos autres programmes (un jeu, par exemple).
- Discord recharge ce dont il a besoin au fur et à mesure. Juste après le vidage, changer de salon peut être un peu plus lent pendant une ou deux secondes.
- La consommation remonte avec le temps, car Discord recommence à garder des éléments en mémoire. C'est pour cela que le vidage peut être **automatique** : l'option « Libérer la mémoire après N minutes en arrière-plan » le déclenche quand Discord est caché depuis N minutes.
- **Vider le cache HTTP** est différent : il supprime les fichiers téléchargés stockés sur le disque. Cela libère de l'espace disque, pas de la RAM, et les images seront retéléchargées.

## 4. Les profils

| Option | Origine | Équilibré | Économie |
|---|---|---|---|
| Réduire les animations | non | non | oui |
| Masquer les décorations animées (avatars, effets de profil, nameplates) | non | non | oui |
| Mettre en pause les GIF et vidéos muettes quand Discord est caché | non | oui | oui |
| Ralentir Discord en arrière-plan | non | non | oui |
| Priorité basse quand Discord est réduit | non | non | oui |
| Vidage automatique de la RAM en arrière-plan | jamais | après 15 min | après 5 min |

Le profil **Personnalisé** affiche chaque option séparément. Tout s'applique immédiatement, sans redémarrage, et revient en arrière de la même façon.

Deux options ont un effet secondaire :

- **Ralentir Discord en arrière-plan** : Chromium réduit l'activité de la page quand elle est cachée. Les notifications peuvent arriver avec un léger retard.
- **Priorité basse quand Discord est réduit** : Windows donne la priorité aux autres programmes. À éviter pendant un appel vocal, car le son passe par ce processus.

## 5. Réglages de Discord

Les GIF, émojis et autocollants animés sont ce qui coûte le plus à Discord. Le bouton **Désactiver la lecture automatique des médias dans Discord** modifie trois réglages de votre compte Discord :

- lecture automatique des GIF : désactivée ;
- émojis animés : désactivés ;
- autocollants animés : jamais.

Ces réglages appartiennent à votre compte : ils s'appliquent aussi sur vos autres appareils. Pour revenir en arrière : *Paramètres Discord → Accessibilité*.

## 6. Options du moteur

Ces trois options agissent sur Chromium, le moteur de Discord. Elles ne peuvent être appliquées qu'au démarrage : **un redémarrage de Discord est nécessaire** après les avoir changées.

| Option | Effet | Contrepartie |
|---|---|---|
| Limiter le cache disque à 150 Mo | Empêche le cache de Discord de grossir jusqu'à plusieurs Go sur le disque. | Les anciennes images sont retéléchargées plus souvent. |
| Moteur JavaScript économe en mémoire | Le moteur privilégie la mémoire plutôt que la vitesse. | Discord peut être un peu moins réactif. |
| Mode « appareil modeste » de Chromium (expérimental) | Chromium se comporte comme sur un appareil avec peu de mémoire : moins de caches, images stockées de façon plus compacte. | Les dégradés de couleur peuvent paraître moins lisses. À tester : désactivez-la si l'affichage vous gêne. |

## 7. Ce que Halo consomme lui-même

Il n'est pas possible d'ajouter des fonctions à Discord sans rien consommer du tout. Voici ce qui est fait pour rester au plus bas :

- **Halo** ajoute environ 800 Ko de code au démarrage. Une fois chargé, il ne fait presque rien par lui-même : ce sont les plugins activés qui travaillent.
- **Un plugin désactivé ne coûte rien.** Son code n'est pas exécuté et Discord n'est pas modifié pour lui.
- **Un plugin activé** coûte ce qu'il fait. Un plugin qui ajoute un bouton ne coûte presque rien. Un plugin qui modifie chaque message affiché coûte un peu à chaque message. N'activez que ceux dont vous vous servez.
- **Les thèmes** sont du CSS. Un thème simple (couleurs) est gratuit. Un thème complexe force Discord à recalculer l'affichage plus souvent, surtout s'il utilise le sélecteur `:has()`. Si Discord devient lent, désactivez vos thèmes pour vérifier.
- **Le moniteur** ne mesure rien quand Discord est caché, et la mesure du GPU n'est faite qu'à la demande.
- **Les badges** sont vérifiés une fois au démarrage puis toutes les 6 heures.

Conseil : profil **Équilibré**, peu de plugins, un thème simple, et le bouton **Libérer la mémoire** avant de lancer un jeu.
