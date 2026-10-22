# Monumento API REST

API REST développée en TypeScript avec Express, Sequelize et MySQL pour gérer un catalogue de monuments historiques, leurs anecdotes et les favoris des utilisateurs.

## Présentation

Monumento permet de :

- gérer des monuments (liste, détail, création, modification, suppression) ;
- ajouter et gérer des anecdotes associées à un monument ;
- gérer les favoris d'un utilisateur ;
- authentifier les utilisateurs via JWT ;
- restreindre certaines actions aux administrateurs ;
- documenter l'API via Swagger ;
- exposer des événements temps réel via Socket.IO.

Le projet contient aussi des fichiers HTML clients dans le dossier `client/` pour tester l'interface web côté navigateur.

---

## Stack technique

- Node.js
- TypeScript
- Express
- Sequelize
- MySQL
- JWT
- Socket.IO
- Swagger UI
- Helmet, CORS et rate limiting

---

## Structure du projet

```text
monumento-api-rest/
├── client/                  # Interfaces HTML de test
│   ├── index-admin.html
│   ├── index-guide.html
│   ├── index-visiteur.html
│   ├── inscription-visiteur.html
│   ├── login.html
│   └── monuments.html
├── src/
│   ├── app.ts               # Configuration Express
│   ├── server.ts            # Démarrage du serveur
│   ├── config/
│   ├── controllers/
│   ├── db/
│   ├── docs/
│   ├── errors/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── socket/
│   └── types/
├── package.json
├── query.sql
├── tsconfig.json
├── README.md
└── .env                     # à créer localement
```

---

## Prérequis

Avant de lancer le projet, vérifiez que vous avez :

- Node.js installé
- npm installé
- une base MySQL accessible localement ou distante
- un fichier `.env` configuré

---

## Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=monumento
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_secret_jwt_tres_secure
ACCESS_TOKEN_TTL=1800
REFRESH_TOKEN_TTL=604800
NODE_ENV=development
```

Les variables obligatoires sont :

- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`

Le projet utilise Sequelize avec `sequelize.sync({ alter: true })` au démarrage, ce qui permet de synchroniser automatiquement les tables MySQL avec les modèles.

---

## Installation

```bash
npm install
```

---

## Démarrage

### Mode développement

```bash
npm run dev
```

Le serveur démarre sur le port configuré dans `.env` (par défaut `http://localhost:3000`).

### Build de production

```bash
npm run build
```

### Lancement du build compilé

```bash
npm start
```

---

## Documentation API

La documentation Swagger est disponible ici :

```text
http://localhost:3000/api-docs
```

Elle décrit les endpoints, les paramètres et les schémas de réponse.

---

## Authentification

L'API utilise des tokens JWT.

### Routes publiques

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh-token`

### Routes protégées

Le header suivant doit être envoyé :

```http
Authorization: Bearer <accessToken>
```

Exemple de payload attendu lors de l'inscription ou de la connexion :

```json
{
  "username": "visiteur",
  "password": "secret123"
}
```

La connexion renvoie des jetons :

```json
{
  "userId": 1,
  "accessToken": "...",
  "refreshToken": "..."
}
```

---

## Endpoints principaux

### Authentification

```http
POST /auth/register
POST /auth/login
POST /auth/refresh-token
POST /auth/logout
```

### Monuments

```http
GET /monuments
GET /monuments/:id
POST /monuments
PUT /monuments/:id
DELETE /monuments/:id
GET /monuments/:id/anecdotes
POST /monuments/:id/anecdotes
```

### Anecdotes

```http
PUT /anecdotes/:id
DELETE /anecdotes/:id
```

### Favoris

```http
GET /favorites
POST /favorites/:monumentId
DELETE /favorites/:monumentId
```

### Administration

Les routes suivantes sont réservées aux comptes admin :

```http
GET /admin/users
PATCH /admin/users/:id
DELETE /admin/users/:id
```

---

## Filtres et paramètres

### `GET /monuments`

Paramètres optionnels :

- `title`: filtre les monuments contenant un titre donné
- `orderBy`: tri (`title`, `buildYear`, `createdAt`)
- `limit`: limite de résultats

Exemple :

```http
GET /monuments?title=eiffel&orderBy=title&limit=10
```

---

## Données de démonstration

Un fichier `query.sql` est présent à la racine du projet. Il contient des monuments d'exemple :

- Tour Eiffel
- Statue de la Liberté
- Colisée

Vous pouvez l'utiliser pour alimenter rapidement la base.

---

## Interface client

Le dossier `client/` contient des pages HTML qui permettent de tester l'application :

- `login.html`: connexion
- `inscription-visiteur.html`: inscription
- `index-visiteur.html`: interface visiteur
- `index-guide.html`: interface guide
- `index-admin.html`: interface administration
- `monuments.html`: catalogue des monuments

---

## Premier administrateur

Pour créer le premier compte admin :

1. créer un compte via l'interface HTML ou `POST /auth/register` ;
2. modifier son rôle en base avec MySQL :

```sql
UPDATE users SET role = 'admin' WHERE username = 'votre_nom_utilisateur';
```

3. se connecter avec ce compte puis utiliser le token dans le front d'administration.

---

## Sécurité

Le serveur applique plusieurs protections :

- `helmet()` pour des en-têtes HTTP sécurisés ;
- `cors()` pour le contrôle des origines ;
- `express-rate-limit` sur le login ;
- authentification JWT sur les routes protégées ;
- contrôle du rôle `admin` sur les routes d'administration.

---

## Exemple de requête

### Inscription

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "visiteur",
    "password": "secret123"
  }'
```

### Connexion

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "visiteur",
    "password": "secret123"
  }'
```

### Récupération de la liste des monuments

```bash
curl -X GET http://localhost:3000/monuments \
  -H "Authorization: Bearer <accessToken>"
```

---

## Notes

- Le projet est pensé pour un usage local / de démonstration.
- Les routes CORS sont actuellement ouvertes avec `origin: "*"` pour simplifier les tests front-end.
- La base de données est automatiquement synchronisée au démarrage. C'est pratique pour le développement, mais il est recommandé de maîtriser les migrations en environnement de production.

---

## License

Projet sous licence ISC.
