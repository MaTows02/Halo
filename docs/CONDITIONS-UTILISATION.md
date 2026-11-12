# Halo et les conditions d'utilisation de Discord

Les [conditions d'utilisation de Discord](https://discord.com/terms) interdisent de modifier le client. Discord a déclaré que les clients modifiés ne sont pas autorisés. Les sanctions visent surtout les comportements visibles côté serveur, mais **tout usage de Halo est à vos risques**.

## Niveau de risque par type de fonction

| Type | Exemples | Risque pour le compte |
|---|---|---|
| Modification du client | Installateur, injection, interface Halo | Contraire aux CGU, rarement sanctionné seul |
| Visuel / local | Thèmes, QuickCSS, HaloPerformance, HaloConfidentialite, HaloBlocNotes, la plupart des plugins d'apparence | Faible : rien n'est visible côté serveur |
| Lecture de données cachées | ShowHiddenChannels, MessageLogger, etc. | Moyen |
| Automatisation ou envoi de requêtes au nom du compte | Plugins qui agissent à votre place | Élevé |
| Contournement de fonctions payantes | **fakeNitro**, **spotifyCrack** | Élevé, et contraire aux conditions de Discord et de Spotify |

## Plugins sensibles

La base contient `fakeNitro` et `spotifyCrack`, qui contournent des fonctions payantes. Ils ne sont **pas activés par défaut**. Ils gardent leurs anciens en-têtes, d'où deux erreurs de lint attendues.

Avant de distribuer Halo publiquement, envisagez de les retirer du dépôt : ce sont eux qui exposent le plus les utilisateurs et le projet.

## Recommandations

- Laissez cet avertissement visible dans le README.
- N'utilisez ni le nom ni le logo de Discord dans l'identité du projet.
- Relisez tout plugin tiers avant de l'ajouter.
