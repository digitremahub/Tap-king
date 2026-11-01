# TAP KING — Prototype 0.1

Jeu web mobile-first d'ascension verticale par tapotements.

## Stack
- Next.js 14 / React 18
- TypeScript
- Phaser prévu pour la prochaine étape de rendu du jeu
- Vercel pour l'hébergement

## Fonctionnalités présentes
- Écran d'accueil TAP KING
- Run solo de 20 secondes
- Compteur d'altitude et record local
- Combos
- Événements de plateforme instable et chutes
- Collecte aléatoire de quatre bonus
- Utilisation de bonus
- Partage du résultat via Web Share ou copie

## Lancer en local
```bash
npm install
npm run dev
```
Ouvrir http://localhost:3000.

## Build
```bash
npm run build
```

## Déploiement
Importer le dépôt GitHub dans Vercel, framework Next.js, commande de build `npm run build`.

## Limites connues du prototype
- La boucle de jeu est une première simulation React/CSS, pas encore un moteur Phaser complet.
- Le personnage et les plateformes utilisent des emojis et des formes CSS temporaires.
- Les obstacles sont des fenêtres de timing ; le système devra être retravaillé pour rendre l'échec lisible et équitable.
- Les bonus sont générés localement et ne sont pas synchronisés entre joueurs.
- Le mode duel, les comptes, le classement et la validation serveur ne sont pas encore implémentés.
- Les scores locaux ne sont pas anti-triche et ne doivent pas servir à un classement compétitif.
- Le nom TAP KING est provisoire et doit faire l'objet d'une recherche d'antériorité.

## Roadmap
1. Remplacer le prototype d'interface par une scène Phaser 3.
2. Ajouter tutoriel et calibrage du rythme.
3. Ajouter défis asynchrones et validation serveur.
4. Ajouter Supabase, profils et classements.
5. Ajouter progression cosmétique et événements.