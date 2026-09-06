#!/bin/bash

# Script de déploiement manuel pour Hostinger
# Usage: ./deploy.sh

echo "🚀 Déploiement vers Hostinger..."

# Variables (configurées avec vos informations Hostinger)
REMOTE_HOST="185.166.188.65"
REMOTE_PORT="65002"
REMOTE_USER="u220939269"
# Le php du PATH est en 8.3 sur ce serveur, incompatible avec les dependances
# (>= 8.4.1) : toutes les commandes artisan echouaient silencieusement.
PHP_BIN="/opt/alt/php84/usr/bin/php"
# Racine de l'application Laravel (contient artisan)
REMOTE_PATH="/home/u220939269/rck-pellets"
# Racine servie par le domaine (contient le public/ de Laravel)
REMOTE_DOCROOT="/home/u220939269/domains/jardinesgerardolienashop.es/public_html"

# Build des assets localement
echo "🔨 Build des assets localement..."
npm run build

# Dépendances PHP de production, construites à l'écart.
#
# Un "composer install --no-dev" dans le projet supprimerait PHPUnit et les
# autres outils de développement de la machine. On installe donc dans un
# dossier temporaire, qu'on transfère à la place de vendor/.
echo "📦 Construction des dépendances PHP de production..."
VENDOR_BUILD="$(mktemp -d)"
trap 'rm -rf "${VENDOR_BUILD}"' EXIT

cp composer.json composer.lock "${VENDOR_BUILD}/"
composer install \
  --working-dir="${VENDOR_BUILD}" \
  --no-dev --optimize-autoloader --no-interaction --no-scripts

if [ ! -d "${VENDOR_BUILD}/vendor" ]; then
  echo "❌ Échec de l'installation des dépendances." >&2
  exit 1
fi

# Copie des fichiers via rsync
echo "📦 Copie des fichiers..."
rsync -avz -e "ssh -p ${REMOTE_PORT}" --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.github' \
  --exclude 'storage/logs' \
  --exclude 'storage/app' \
  --exclude 'public/storage' \
  --exclude 'storage/framework/cache' \
  --exclude 'storage/framework/sessions' \
  --exclude 'storage/framework/views' \
  --exclude '.env' \
  --exclude 'env-production*.txt' \
  --exclude 'database/*.sql' \
  --exclude 'database/*.sqlite' \
  --exclude '.DS_Store' \
  --exclude 'vendor' \
  --exclude 'bootstrap/cache' \
  ./ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/

echo "📦 Copie des dépendances PHP..."
rsync -avz -e "ssh -p ${REMOTE_PORT}" --delete \
  "${VENDOR_BUILD}/vendor/" ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/vendor/

# Le docroot expose le contenu de public/ ; il doit suivre le build.
# index.php du docroot est un bootstrap sur mesure ($basePath absolu vers
# REMOTE_PATH) : l'ecraser avec le public/index.php standard de Laravel
# mettrait le site hors ligne. Ne jamais le transferer.
echo "📦 Copie des assets publics vers le docroot..."
rsync -avz -e "ssh -p ${REMOTE_PORT}" \
  --exclude 'storage' \
  --exclude 'index.php' \
  public/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DOCROOT}/

# Exécution des commandes sur le serveur distant
echo "🔧 Configuration sur le serveur..."
ssh -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} << EOF
  cd ${REMOTE_PATH}
  
  # bootstrap/cache n'est pas transfere : il est regenere ici a partir du
  # vendor de production, sans les paquets de developpement.
  ${PHP_BIN} artisan package:discover

  # Migration de la base de données
  ${PHP_BIN} artisan migrate --force

  # Guides : updateOrCreate sur le slug, les modifications faites depuis
  # l'administration sur d'autres articles ne sont pas touchées.
  ${PHP_BIN} artisan db:seed --class=ArticleSeeder --force
  
  # Lien du storage
  #
  # storage:link cree le lien dans public/, mais le domaine est servi
  # depuis un autre dossier. Sans ce second lien, les images televersees
  # depuis l'administration ne sont pas servies.
  ${PHP_BIN} artisan storage:link
  ln -sfn ${REMOTE_PATH}/storage/app/public ${REMOTE_DOCROOT}/storage
  
  # Cache
  ${PHP_BIN} artisan cache:clear
  ${PHP_BIN} artisan config:clear
  ${PHP_BIN} artisan route:clear
  ${PHP_BIN} artisan view:clear
  ${PHP_BIN} artisan config:cache
  ${PHP_BIN} artisan route:cache
  ${PHP_BIN} artisan view:cache
  
  # Permissions
  chmod -R 755 storage bootstrap/cache
  chmod -R 777 storage/app/public

  # OPcache conserve l'ancien bytecode : le vider sinon le code deploye
  # reste sans effet jusqu'au prochain redemarrage de PHP-FPM.
  ${PHP_BIN} -r 'function_exists("opcache_reset") && opcache_reset();' || true
EOF

echo "✅ Déploiement terminé !"
