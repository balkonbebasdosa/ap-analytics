FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app

# Install Python 3 and ML dependencies for the BVI predictor
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 python3-pip python3-numpy python3-scipy \
      gcc python3-dev libgeos-dev libgdal-dev gdal-bin && \
    pip3 install --no-cache-dir --break-system-packages \
      scikit-learn pandas xgboost geopandas shapely && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma
COPY business_viability_model.pkl ./business_viability_model.pkl
COPY data ./data
COPY src/lib/bvi_predictor.py ./dist/lib/bvi_predictor.py

EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
