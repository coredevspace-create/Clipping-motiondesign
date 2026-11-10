# Catalogue des scènes

Chaque scène d'un épisode a un `type` parmi ceux-ci. Les animations se déclenchent sur des **mots de la phrase
`sub`** : si le mot n'y est pas, l'élément apparaît plus tôt ou plus tard (valeur de secours), donc reprendre
les mots indiqués quand c'est possible. Titres fixes sauf mention « configurable ».

## Accroches (1re scène)
| type | visuel | mots déclencheurs | titre |
|---|---|---|---|
| `hook` | logiciel restaurant + compteur 0 → 7 500 € | « jusqu'à » | « Ce logiciel 3D se vend jusqu'à » |
| `premier` | carte de ville, radar « TOI », pins métiers (verts au mot « ça ») | « ça » | « Sois le premier de ta ville » |
| `sitesWeb` | maquette de site barrée d'une croix rouge + tampon STOP | « sites » | « Arrête de vendre des sites web » |
| `equation` | 29 € → flèche → 7 500 € ? | « 29 », « 7 » | « Comment transformer » |
| `promptReveal` | prompt tapé lettre par lettre puis flash + logiciel restaurant | « regarde » | change au mot « regarde » |
| `teaser` | 3 cartes « 1 ? 2 ? 3 ? » qui se retournent sur les logiciels | — | « 3 secteurs vont s'arracher ça » |
| `focus` | **configurable** (voir plus bas) : idéal pour « Imagine… », « POV… », « N°1 » | puces | configurable |

## Corps
| type | visuel | mots déclencheurs |
|---|---|---|
| `vingtMinutes` | faux chat Claude + barre de génération + « 20 min » / « 0 ligne de code » ; option `"prompt"` = texte du message | « sans » |
| `vieuxLogiciel` | vieux logiciel barré + tampon DÉPASSÉ, titre « 90 % des entreprises utilisent encore ça » | « encore » |
| `nouveauLogiciel` | « Toi, tu arrives avec ça » : 3 logiciels qui défilent + puces Carte 3D / Animée / Sur mesure | « carte », « 3D », « animée », « mesure » |
| `secteurs` | grille 2×2 : Carrosserie, Restaurant, Agence immo, Agence marketing | « carrosserie », « restaurant », « agence », « prompt » |
| `metiers` | 3 cartes icônes Garage / Restaurant / Agence + « Pour gérer leurs clients » | « garage », « restaurant », « agence », « besoin » |
| `dejaSites` | grille de 6 sites cochés, « Elles en ont déjà un » | — |
| `avantApres` | panneau AVANT (mois de travail, équipe de devs) barré → AUJOURD'HUI (1 prompt, Claude) | « mois », « équipe », « aujourd », « prompt », « claude » |
| `etapes` | 01 donner le prompt à Claude / 02 répondre aux questions / 03 prêt | « donnes », « réponds », « prêt » |
| `outils` | hub « 3D Ton logiciel » relié à Outlook, Teams, Excel | « outlook », « teams », « excel » |
| `visite` | logiciel restaurant qui zoome + points Tables / Réservations / En direct | « tables », « réservations », « direct » |
| `offre` | carte « prompt + guide + script d'appel » avec étiquette 29 € | « prompt », « guide », « prix » |
| `script` | téléphone : relance d'un client + puces Script d'appel / Relances WhatsApp | « script », « relances », « whatsapp » |
| `inclus` | liste cochée : prompt, guide, script d'appel, communauté + tampon INCLUS | « prompt », « guide », « script », « tout » |
| `prixVente` | « Un seul logiciel jusqu'à » + compteur 7 500 € + logiciel marketing | « 7 » |
| `prix` | 199 € barré → 29 € + « Ensuite, le prix repasse à 199 € » | « 199 », « 29 », « mais » |

## Fin (toujours)
| type | visuel |
|---|---|
| `commenteCRM` | « Commente « CRM » » + on tape CRM dans les commentaires + réponse « Je t'envoie le lien en privé » |
| `cta` | ancien CTA « lien en bio » — **ne plus utiliser** |

## `focus` (configurable)
```json
{ "type": "focus", "say": "…", "sub": "…", "highlight": [],
  "focus": {
    "kicker": "Imagine",            // facultatif : pastille jaune, ou « N°1 » en gros chiffre rouge
    "title": ["Tu montres ça", "à un garagiste"],   // 2e ligne en rouge (en blanc si kicker N°…)
    "image": "images/carrosserie.png",               // carrosserie | restaurant | immobilier | marketing
    "zoom": false,                  // true = zoom lent plein cadre sur l'image
    "chips": [{ "t": "En direct", "w": "direct" }]   // puces qui apparaissent au mot w
  } }
```

## Images disponibles (`public/images/`)
`carrosserie.png`, `restaurant.png`, `immobilier.png`, `marketing.png` (logiciels 3D), `vieux-logiciel.png`.
