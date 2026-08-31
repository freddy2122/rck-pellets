# Guide de déploiement CI/CD sur Hostinger

## Prérequis

- Compte GitHub avec le projet
- Hébergement Hostinger avec accès SSH
- Base de données MySQL sur Hostinger

## Configuration des Secrets GitHub

Allez dans votre repository GitHub → Settings → Secrets and variables → Actions → New repository secret

### Secrets obligatoires

**SSH & Serveur :**
- `SSH_PRIVATE_KEY` : Votre clé SSH privée (générée avec `ssh-keygen`)
- `REMOTE_HOST` : Adresse de votre serveur Hostinger (ex: `185.166.188.65`)
- `REMOTE_PORT` : Port SSH (ex: `65002` pour Hostinger)
- `REMOTE_USER` : Nom d'utilisateur SSH Hostinger (ex: `u220939269`)
- `REMOTE_TARGET` : Chemin absolu du projet sur le serveur (ex: `/home/u220939269/public_html`)

**Application Laravel :**
- `APP_NAME` : Nom de l'application (ex: `Jardines lena Shop`)
- `APP_URL` : URL de production (ex: `https://votre-domaine.com`)
- `APP_KEY` : Clé de chiffrement Laravel (générée avec `php artisan key:generate`)

**Base de données :**
- `DB_CONNECTION` : `mysql`
- `DB_HOST` : Host de la base Hostinger (ex: `localhost`)
- `DB_PORT` : Port (généralement `3306`)
- `DB_DATABASE` : Nom de la base de données
- `DB_USERNAME` : Utilisateur de la base
- `DB_PASSWORD` : Mot de passe de la base

**Administrateur :**
- `ADMIN_EMAIL` : Email de l'admin
- `ADMIN_PASSWORD` : Mot de passe de l'admin
- `ADMIN_NAME` : Nom de l'admin
- `ADMIN_PHONE` : Téléphone (optionnel)
- `ADMIN_ADDRESS` : Adresse (optionnel)
- `ADMIN_CITY` : Ville (optionnel)
- `ADMIN_PROVINCE` : Province (optionnel)
- `ADMIN_COUNTRY` : Pays (optionnel)

**Email :**
- `MAIL_MAILER` : `smtp`
- `MAIL_HOST` : Serveur SMTP Hostinger
- `MAIL_PORT` : Port SMTP (généralement `587` ou `465`)
- `MAIL_USERNAME` : Email SMTP
- `MAIL_PASSWORD` : Mot de passe SMTP
- `MAIL_ENCRYPTION` : `tls` ou `ssl`
- `MAIL_FROM_ADDRESS` : Email d'envoi
- `MAIL_FROM_NAME` : Nom d'envoi

**Contact public :**
- `PUBLIC_CONTACT_EMAIL` : Email public de contact
- `BANK_IBAN` : IBAN bancaire
- `BANK_BIC` : Code BIC/SWIFT

## Génération de la clé SSH

Sur votre machine locale :

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_hostinger
```

Ajoutez la clé publique au serveur Hostinger (port 65002) :

```bash
ssh-copy-id -p 65002 -i ~/.ssh/github_hostinger.pub u220939269@185.166.188.65
```

Ou manuellement :
```bash
cat ~/.ssh/github_hostinger.pub | ssh -p 65002 u220939269@185.166.188.65 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

Copiez le contenu de la clé privée (`~/.ssh/github_hostinger`) et ajoutez-le au secret `SSH_PRIVATE_KEY` dans GitHub.

## Configuration Hostinger

### 1. Activer l'accès SSH

- Connectez-vous au panel Hostinger
- Allez dans Hébergement → Gérer → SSH Access
- Activez SSH et notez les identifiants

### 2. Créer la base de données

- Allez dans Bases de données MySQL
- Créez une nouvelle base de données
- Notez le nom, l'utilisateur et le mot de passe

### 3. Configurer PHP

- Allez dans PHP Selector
- Sélectionnez PHP 8.3 ou supérieur
- Activez les extensions nécessaires : `mbstring`, `xml`, `pdo`, `pdo_mysql`, `bcmath`, `json`, `tokenizer`

### 4. Permissions

Exécutez ces commandes sur le serveur après le premier déploiement :

```bash
cd /home/username/public_html
chmod -R 755 storage bootstrap/cache
chmod -R 777 storage/app/public
```

## Déploiement automatique

Le workflow GitHub Actions se déclenche automatiquement à chaque push sur les branches `main` ou `master`.

Vous pouvez aussi le déclencher manuellement depuis l'onglet "Actions" dans GitHub.

## Déploiement manuel

Pour un déploiement manuel via SSH :

```bash
# Rendez le script exécutable
chmod +x deploy.sh

# Modifiez les variables dans deploy.sh
# REMOTE_HOST, REMOTE_USER, REMOTE_PATH

# Exécutez le déploiement
./deploy.sh
```

## Vérification après déploiement

1. Vérifiez que le site est accessible
2. Testez la connexion admin : `/admin/login`
3. Vérifiez que les assets sont chargés
4. Testez le formulaire de contact
5. Vérifiez que les commandes fonctionnent

## Dépannage

### Erreur de permission

```bash
ssh user@votre-domaine.com
cd /home/username/public_html
chmod -R 755 storage bootstrap/cache
chmod -R 777 storage/app/public
```

### Erreur de base de données

Vérifiez les credentials dans les secrets GitHub et que la base existe sur Hostinger.

### Erreur de cache

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Erreur de storage link

```bash
php artisan storage:link
```
