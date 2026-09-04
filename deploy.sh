#!/bin/bash

# Script de déploiement manuel pour Hostinger
# Usage: ./deploy.sh

echo "🚀 Déploiement vers Hostinger..."

# Variables (configurées avec vos informations Hostinger)
REMOTE_HOST="185.166.188.65"
REMOTE_PORT="65002"
REMOTE_USER="u220939269"
# Racine de l'application Laravel (contient artisan)
REMOTE_PATH="/home/u220939269/rck-pellets"
# Racine servie par le domaine (contient le public/ de Laravel)
REMOTE_DOCROOT="/home/u220939269/public_html"

# Build des assets localement
echo "🔨 Build des assets localement..."
npm run build

# Installation des dépendances PHP localement
echo "📦 Installation des dépendances PHP localement..."
composer install --no-dev --optimize-autoloader --no-interaction

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
  ./ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/

# Le docroot expose le contenu de public/ ; il doit suivre le build.
# Sans effet si REMOTE_DOCROOT est un lien symbolique vers ${REMOTE_PATH}/public.
echo "📦 Copie des assets publics vers le docroot..."
rsync -avz -e "ssh -p ${REMOTE_PORT}" \
  --exclude 'storage' \
  public/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DOCROOT}/

# Exécution des commandes sur le serveur distant
echo "🔧 Configuration sur le serveur..."
ssh -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} << EOF
  cd ${REMOTE_PATH}
  
  # Migration de la base de données
  php artisan migrate --force
  
  # Lien du storage
  php artisan storage:link
  
  # Cache
  php artisan cache:clear
  php artisan config:clear
  php artisan route:clear
  php artisan view:clear
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
  
  # Permissions
  chmod -R 755 storage bootstrap/cache
  chmod -R 777 storage/app/public

  # OPcache conserve l'ancien bytecode : le vider sinon le code deploye
  # reste sans effet jusqu'au prochain redemarrage de PHP-FPM.
  php -r 'function_exists("opcache_reset") && opcache_reset();' || true
EOF

echo "✅ Déploiement terminé !"
