# ⏰

POC application de réveil avec Electron et React.

## Choix notables

La persistence des alarmes est gérée simplement par `electron-store` (fichier json), compte tenu de l'usage très "synchrone" de l'application.

Les communications IPC sont typées de bout en bout, depuis le fichier de preload.

Le processus main est utilisé comme source de vérité pour l'horloge et envoie son calcul au renderer.

Très peu de dépendances, notamment sur le renderer qui est rudimentaire.

## Usage

`pnpm dev`: Lancement local avec HMR pour le renderer et rechargement auto pour le main.

`pnpm start`: Lancement de prévisualisation finale après "build" des fichiers JS.

## Todo

### Fonctionnel

- Ajouter un son à l'alarme (qui clignote uniquement pour le moment).
- Gestion AM/PM complète (la liste affiche toujours au format 24h).
- Gérer les jours de la semaine par alarme.
- Pouvoir éditer une alarme existante.
- Améliorer le style.
- Enregistrer la position et la dimension de la fenêtre au moment de la fermeture.
- Pouvoir choisir le son de l'alarme.
- Pouvoir réduire l'application dans le tray menu.

### Technique

- Ecrire les logs applicatifs dans des fichiers dédiés.
- Réfléchir à une stratégie de test automatique.
- Configuration du packaging de l'application.
