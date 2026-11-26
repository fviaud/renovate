# renovate

Frontend [Next.js](https://nextjs.org) (avec [shadcn/ui](https://ui.shadcn.com) et Tailwind CSS) dont les dépendances sont tenues à jour automatiquement par [Renovate](https://docs.renovatebot.com), exécuté en self-hosted via GitHub Actions.

Chaque modification passe par une pull request testée par la CI. L'image Docker du frontend est publiée sur GitHub Container Registry à chaque mise à jour de `main`.

## Structure

```
.
├── frontend/                     Application Next.js
│   ├── src/                      Pages (app/), composants (components/), utilitaires (lib/)
│   ├── Dockerfile                Image de production (multi-étapes, output standalone)
│   └── .dockerignore
├── .github/workflows/
│   ├── frontend.yml              CI : lint, build, image Docker, publication ghcr.io
│   └── renovate.yml              Renovate : validation de la config et analyse quotidienne
└── renovate.json                 Configuration de Renovate
```

## Développement local

Prérequis : Node.js, de préférence dans la version utilisée par la CI (`node-version` dans `.github/workflows/frontend.yml`), et npm.

```bash
cd frontend
npm ci              # installe les dépendances depuis package-lock.json
npm run dev         # serveur de développement sur http://localhost:3000
npm run lint        # ESLint
npm run build       # build de production (vérifie aussi les types TypeScript)
```

`next.config.ts` utilise `output: "standalone"` pour l'image Docker. `npm run start` fonctionne mais affiche un avertissement : en production, le serveur se lance avec `node .next/standalone/server.js` (c'est ce que fait l'image).

## Image Docker

L'image est construite en trois étapes (dépendances, build, image finale). L'image finale ne contient que le serveur standalone de Next.js, tourne avec l'utilisateur non-root `node` et expose le port 3000. Un healthcheck vérifie que la page d'accueil répond.

### Construire et lancer localement

```bash
docker build -t renovate-frontend frontend
docker run --rm -p 3000:3000 renovate-frontend
```

### Récupérer l'image publiée

Le package est public, aucune authentification n'est nécessaire :

```bash
docker pull ghcr.io/fviaud/renovate-frontend:latest
docker run --rm -p 3000:3000 ghcr.io/fviaud/renovate-frontend:latest
```

| Tag | Contenu |
|---|---|
| `latest` | Dernière version de `main` |
| `sha-<commit>` | Image d'un commit précis (7 premiers caractères du SHA) |

L'image n'est construite que pour `linux/amd64`. Sur une machine ARM (Mac Apple Silicon), ajouter `--platform linux/amd64` pour la lancer en émulation.

## CI (GitHub Actions)

### `frontend.yml` : sur chaque PR et chaque push sur `main`

| Job | Étapes |
|---|---|
| **Lint et build** | `npm ci` (échoue si `package.json` et `package-lock.json` ne correspondent pas), `npm run lint`, `npm run build` |
| **Image Docker** | Build de l'image, démarrage du conteneur et vérification que `/` répond |

Sur `main` uniquement, le job **Image Docker** ensuite :

1. publie l'image sur `ghcr.io/fviaud/renovate-frontend` (tags `latest` et `sha-<commit>`) avec le `GITHUB_TOKEN` ;
2. supprime les anciennes versions du package pour n'en garder que les 10 plus récentes.

### `renovate.yml`

| Job | Quand |
|---|---|
| **Valider la config Renovate** (`renovate-config-validator --strict`) | PR et push sur `main` qui modifient `renovate.json` ou ce workflow, et avant chaque analyse |
| **Analyse des dépendances** (Renovate) | Tous les jours à 04:17 UTC, au lancement manuel, et quand `renovate.json` change sur `main`. Jamais sur les PR. |

## Renovate

Renovate analyse `main`, compare les versions des dépendances (npm, image Docker, actions GitHub, version de Node de la CI) aux dernières versions publiées, et ouvre une PR par mise à jour ou par groupe.

### Lancer Renovate manuellement

Onglet **Actions** → **Renovate** → **Run workflow**, avec :

- `dryRun` : `lookup` ou `full` pour analyser sans créer de branche ni de PR ;
- `logLevel` : `debug` pour plus de détails.

### Règles (`renovate.json`)

| Règle | Effet |
|---|---|
| Base `config:recommended` | Configuration standard de Renovate, labels `dependencies` |
| Groupe **frontend (minor/patch)** | Les mises à jour mineures et correctives de `frontend/` arrivent dans une seule PR |
| Groupe **Node.js** | L'image Docker, la version de Node de la CI et les majeures de `@types/node` sont mises à jour ensemble |
| Versions paires de Node.js | Seules les versions LTS (paires) sont proposées pour `node` et `@types/node` |
| Digest épinglé | L'image de base `node` du Dockerfile est épinglée par tag et digest |
| TypeScript `< 7` | TypeScript 7 est bloqué tant que `typescript-eslint` ne le supporte pas |
| npm `^11` | Renovate régénère les lockfiles avec npm 11 (voir « Points d'attention ») |
| **Automerge des correctifs** | Les PR qui ne contiennent que des mises à jour correctives sont fusionnées automatiquement dès que la CI est verte |

Les mises à jour mineures (hors correctifs seuls) et majeures restent à fusionner manuellement.

### Token

Renovate utilise le secret de dépôt `RENOVATE_TOKEN` : un token personnel GitHub (PAT classique) avec les droits `repo` et `workflow`. Le droit `workflow` est nécessaire pour mettre à jour les fichiers de `.github/workflows/`. Avec ce token, les PR de Renovate déclenchent la CI (ce ne serait pas le cas avec le `GITHUB_TOKEN`).

## Protection de `main`

Un ruleset GitHub protège `main` :

- pas de push direct ni de force push, pas de suppression de la branche ;
- toute modification passe par une pull request ;
- les checks **Lint et build** et **Image Docker** doivent être verts avant la fusion.

Les branches des PR fusionnées sont supprimées automatiquement.

## Points d'attention

- **npm 12 et les lockfiles** : npm 12 refuse par défaut les téléchargements de type « remote » (`allow-remote=none`), ce qui fait échouer la mise à jour du lockfile pour `@tailwindcss/oxide-wasm32-wasi` (`EALLOWREMOTE`). D'où la contrainte npm `^11` dans `renovate.json`, et la règle qui empêche Renovate de la relever.
- **TypeScript 7** : `typescript-eslint` (utilisé par `eslint-config-next`) ne le supporte pas encore. Retirer la règle `allowedVersions: "<7"` quand ce sera le cas.
- **Versions « untagged » sur ghcr.io** : ne pas supprimer à la main des versions sans tag dans le package. Le nettoyage automatique s'en charge.
- **Fusion d'une PR Renovate** : attendre que la CI soit verte (le ruleset l'impose). Une PR dont le lockfile n'a pas pu être régénéré (« Artifact update problem ») ne doit pas être fusionnée.
