# monumento-api-rest

## Dashboard administrateur

La page d'administration est disponible dans `client/index-admin.html`. Elle permet de :

- créer, modifier et supprimer des monuments ;
- rechercher dans le catalogue ;
- consulter les statistiques de monuments, guides et visiteurs ;
- changer le rôle d'un utilisateur ou supprimer son compte.

Les routes de gestion des comptes sont protégées par le rôle `admin` :

- `GET /admin/users`
- `PATCH /admin/users/:id`
- `DELETE /admin/users/:id`

Pour créer le premier administrateur, inscrivez d'abord un compte depuis `client/inscription-visiteur.html`, puis exécutez cette requête dans MySQL :

```sql
UPDATE users SET role = 'admin' WHERE username = 'votre_nom_utilisateur';
```

Connectez-vous ensuite avec ce compte via `client/login.html`, puis utilisez le token d'accès dans `client/index-admin.html`.
