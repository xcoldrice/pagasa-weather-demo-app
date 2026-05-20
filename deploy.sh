#!/bin/bash

# --- CONFIGURATION ---
SERVER_USER="root"
SERVER_IP="157.245.149.196"
SERVER_DOMAIN="server6.gmstdevops.com"
PROJECT_NAME="pagasa-weather-demo-app"
FRONTEND_IMAGE_NAME="pagasa-weather-demo-app-frontend:latest"
BACKEND_IMAGE_NAME="pagasa-weather-demo-app-backend:latest"

# Server paths
#REMOTE_PROJECT_DIR="/home/$SERVER_USER/training/$PROJECT_NAME"
REMOTE_PROJECT_DIR="~/training/$PROJECT_NAME"
# ---------------------

echo "🚀 Starting deployment for $PROJECT_NAME..."

# Save Docker image locally
echo "📦 Saving Docker image locally..."
docker save $FRONTEND_IMAGE_NAME -o ${PROJECT_NAME}-frontend.tar
docker save $BACKEND_IMAGE_NAME -o ${PROJECT_NAME}-backend.tar

# Transfer the docker images, docker-compose.prod.yml, backend data sample files using rsync with a live progress percentage
echo "🚚 Transferring docker images, docker-compose.prod.yml, backend data sample files to server..."
rsync -ah --progress --info=progress2 \
  ${PROJECT_NAME}-frontend.tar \
  ${PROJECT_NAME}-backend.tar \
  docker-compose.prod.yml \
  ./backend/data/samples/rainfall/sample_rainfall.png \
  ./backend/data/samples/temperature/sample_temperature.png \
  ${SERVER_USER}@${SERVER_DOMAIN}:${REMOTE_PROJECT_DIR}/

# Load the image on the server, run the docker services, and clean up the tar file
echo "⚓ Loading image into server Docker engine..."
ssh ${SERVER_USER}@${SERVER_DOMAIN} "docker load -i ${REMOTE_PROJECT_DIR}/${PROJECT_NAME}-frontend.tar && \
rm ${REMOTE_PROJECT_DIR}/${PROJECT_NAME}-frontend.tar && \
docker load -i ${REMOTE_PROJECT_DIR}/${PROJECT_NAME}-backend.tar && \
rm ${REMOTE_PROJECT_DIR}/${PROJECT_NAME}-backend.tar && \
mkdir -p ${REMOTE_PROJECT_DIR}/backend/data/samples/rainfall && \
mkdir -p ${REMOTE_PROJECT_DIR}/backend/data/samples/temperature && \
mv ${REMOTE_PROJECT_DIR}/sample_rainfall.png ${REMOTE_PROJECT_DIR}/backend/data/samples/rainfall/ && \
mv ${REMOTE_PROJECT_DIR}/sample_temperature.png ${REMOTE_PROJECT_DIR}/backend/data/samples/temperature/ && \
docker compose -f  ${REMOTE_PROJECT_DIR}/docker-compose.prod.yml up -d"

# Clean up local tar file
rm ${PROJECT_NAME}-frontend.tar
rm ${PROJECT_NAME}-backend.tar

echo "✅ Image uploaded successfully and deployment completed!"