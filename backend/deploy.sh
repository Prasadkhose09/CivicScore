#!/bin/bash
set -e

echo "Fetching secrets from AWS SSM..."

DB_URL=$(aws ssm get-parameter \
  --name "/civicscore/db/url" \
  --query "Parameter.Value" \
  --output text)

DB_USERNAME=$(aws ssm get-parameter \
  --name "/civicscore/db/username" \
  --query "Parameter.Value" \
  --output text)

DB_PASSWORD=$(aws ssm get-parameter \
  --name "/civicscore/db/password" \
  --with-decryption \
  --query "Parameter.Value" \
  --output text)

JWT_SECRET=$(aws ssm get-parameter \
  --name "/civicscore/jwt/secret" \
  --with-decryption \
  --query "Parameter.Value" \
  --output text)

echo "Building Docker image..."
docker build -t civicscore-backend .

echo "Stopping old container..."
docker rm -f civicscore-backend 2>/dev/null || true

echo "Starting new container..."
docker run -d \
  --name civicscore-backend \
  --restart unless-stopped \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL="$DB_URL" \
  -e SPRING_DATASOURCE_USERNAME="$DB_USERNAME" \
  -e SPRING_DATASOURCE_PASSWORD="$DB_PASSWORD" \
  -e SPRING_JPA_HIBERNATE_DDL_AUTO=update \
  -e JWT_SECRET="$JWT_SECRET" \
  civicscore-backend

echo "Backend container started successfully!"