# Vidéos motion design Carreia

Vidéos TikTok / Reels / Shorts pour vendre carreia.store, faites avec Remotion + voix Gemini.

## Faire une vidéo
1. Lire `BRAND.md`.
2. Écrire `episodes/NNN.json` (même structure que `001.json`) : pour chaque scène, `type` (une scène de `src/scenes.tsx`),
   `say` (texte lu, nombres en toutes lettres), `sub` (sous-titre), `highlight` (mots en jaune).
3. Voix : `node scripts/voice.mjs NNN` → `public/audio/NNN/` + `src/data/NNN.timing.json`.
   Vérifier les coupures entre scènes ; au besoin, corriger avec `public/audio/NNN/coupes.json`.
4. Ajouter l'épisode dans `src/Root.tsx`, puis `node scripts/render.mjs NNN` → `videos/carreia-NNN.mp4`.
5. Aperçu interactif : `npm run studio`.

La clé Gemini est un secret réseau de l'environnement (hôte `generativelanguage.googleapis.com`, header `x-goog-api-key`),
ou la variable `GEMINI_API_KEY`. Elle n'est jamais dans le code.

## Visuels
`public/images/` : captures recadrées du site carreia.store (logiciels 3D par secteur, vieux logiciel barré).
