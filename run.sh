#!/bin/bash

MODE=${1:-dev}

if [ "$MODE" == "dev" ]; then
    echo "Starting development environment..."
    docker compose -f docker-compose.dev.yml up --build
elif [ "$MODE" == "prod" ]; then
    echo "Starting production environment..."
    docker compose -f docker-compose.prod.yml up --build
else
    echo "Usage: $0 [dev|prod]"
    exit 1
fi
