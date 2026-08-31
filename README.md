# Jardines lena Shop

Boutique Laravel + React/Vite pour vendre pellets et bois de chauffage en Espagne.

## Prerequis

- PHP 8.3+
- Composer
- Node.js 20+
- SQLite en local, ou MySQL/PostgreSQL en production

## Installation locale

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
npm run build
```

Pour lancer le site en developpement :

```bash
php artisan serve
npm run dev
```

## Variables importantes

Renseigner dans `.env` avant un seed ou un deploiement :

```env
APP_NAME="Jardines lena Shop"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=mot-de-passe-fort
ADMIN_NAME="Administrador"

MAIL_MAILER=smtp
MAIL_FROM_ADDRESS=contact@example.com
MAIL_FROM_NAME="${APP_NAME}"

PUBLIC_CONTACT_EMAIL=contact@example.com
BANK_IBAN=ES...
BANK_BIC=...
```

Les coordonnees publiques peuvent ensuite etre modifiees depuis `/admin` :
e-mail, telephone, adresse, ville, province et pays.

## Commandes de verification

```bash
npm run build
php artisan test
php artisan route:list
```

## Deploiement

1. Configurer `.env` production.
2. Installer les dependances : `composer install --no-dev --optimize-autoloader` et `npm ci`.
3. Compiler les assets : `npm run build`.
4. Lancer les migrations : `php artisan migrate --force`.
5. Creer l'admin : `php artisan db:seed --class=AdminSeeder --force`.
6. Lier le stockage public : `php artisan storage:link`.
7. Optimiser Laravel : `php artisan config:cache && php artisan route:cache && php artisan view:cache`.

## Notes fonctionnelles

- Les paiements carte et Klarna ne sont pas affiches tant qu'ils ne sont pas connectes.
- Les commandes sont enregistrees avec paiement manuel par Multibanco ou transfert bancaire.
- Les prix, taxes et frais de livraison sont recalcules cote serveur au moment de la commande.
