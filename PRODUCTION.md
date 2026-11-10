# Production quotidienne : 5 vidéos prêtes avant 7 h (heure de Paris)

Instructions pour la session Claude programmée chaque matin. Tout se passe sur la branche
`claude/motion-design-carreia-videos-nxissn` du repo `coredevspace-create/Clipping-motiondesign`.

## 0. Préparer
```bash
git fetch origin claude/motion-design-carreia-videos-nxissn
git checkout -B claude/motion-design-carreia-videos-nxissn origin/claude/motion-design-carreia-videos-nxissn
npm ci
```
- Date du jour (Paris) : `TZ=Europe/Paris date +%F`. Si `a-poster/<date>/` contient déjà 5 vidéos, s'arrêter.
- Lire `BRAND.md`, `SCENES.md`, `sujets.md`, et un épisode existant (ex. `episodes/006.json`) comme modèle.

## 1. Écrire 5 épisodes
- Prendre les 5 premières accroches non cochées de `sujets.md` (varier les structures).
- Numéros : les 5 suivants après le plus grand `episodes/NNN.json`.
- Chaque `episodes/NNN.json` reprend **exactement** la structure de `episodes/006.json` :
  `id`, `titre`, `voix: "Puck"`, `direction` (copier celle de 006 telle quelle), `description`, `scenes`.
- 5 à 7 scènes, 20 à 30 s au total. Scène 1 = accroche forte (< 3 s à l'oral). Dernière scène = `commenteCRM`
  (copier celle de 006 à l'identique). Au moins une scène avec une capture du logiciel, et du motion design pur ailleurs.
- `say` : nombres **en toutes lettres** (« sept mille cinq cents euros »). `sub` : chiffres avec espace insécable
  entre chiffres et unité (`7 500 €`, `29 €`, `90 %`). Mêmes mots dans `say` et `sub` sinon.
- Reprendre les mots déclencheurs de `SCENES.md` dans les phrases.
- `description` : `👉 Commente « CRM » et je t'envoie le lien pour <bénéfice lié à l'accroche> 🚀 #business #ia #claude #entrepreneur #logiciel3d`
- Rester sur les affirmations du site (BRAND.md). Pas de faux témoignage, pas de chiffre inventé, pas de compte à rebours daté.

## 2. Voix (une requête Gemini par vidéo)
```bash
node scripts/voice.mjs NNN
```
- Le script essaie `gemini-3.8-flash-tts` puis les modèles de secours si le quota gratuit (≈ 10/jour/modèle) est épuisé.
- Les lignes `⚠ scène X : débit …` signalent une coupure probablement mal placée. Pour CHAQUE alerte, transcrire
  la scène signalée et sa voisine avec `gemini-3.5-transcribe` (≈ 5 requêtes/min max : attendre 13 s entre deux) :
  ```bash
  B=$(ffmpeg -v error -i public/audio/NNN/0X.wav -b:a 48k -f mp3 - | base64 -w0)
  printf '{"contents":[{"parts":[{"inlineData":{"mimeType":"audio/mp3","data":"%s"}}]}]}' "$B" \
    | curl -sS -X POST -H "Content-Type: application/json" --data-binary @- \
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-transcribe:generateContent"
  ```
  Si une phrase déborde sur la scène voisine : lister les silences
  (`ffmpeg -hide_banner -i public/audio/NNN/voix.wav -af silencedetect=noise=-38dB:d=0.12 -f null - 2>&1 | grep silence_`),
  choisir le bon, l'écrire dans `public/audio/NNN/coupes.json` = `{"hash": "<hash de voix.json>", "apresScene": {"X": 12.34}}`,
  puis relancer `node scripts/voice.mjs NNN`. S'il n'y a pas de silence, chercher le creux d'énergie le plus bas (fenêtres de 20 ms).
- Si la transcription est en quota épuisé, ne pas bloquer : continuer, et le signaler dans le récapitulatif.

## 3. Rendu
```bash
node scripts/produce.mjs <AAAA-MM-JJ> <1..5> NNN
```
→ `a-poster/<date>/<n>-carreia-NNN.mp4` + `.txt`. Regarder `out/check-NNN.png` (planche 2 images/s) :
texte qui déborde, élément qui chevauche les sous-titres (y ≈ 1400), scène vide → corriger et relancer.

## 4. Livrer
- Cocher les 5 accroches dans `sujets.md` (avec date + numéro). S'il reste < 10 accroches libres, en ajouter 15.
- `git add -A && git commit` (message : « Vidéos du <date> : NNN à NNN ») puis
  `git push -u origin claude/motion-design-carreia-videos-nxissn` (réessayer jusqu'à 4 fois si erreur réseau).
- Terminer par un récapitulatif court : les 5 titres, les durées, les alertes éventuelles.
