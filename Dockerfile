FROM node:24-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends poppler-utils \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --chown=node:node . .
USER node
ENV EVIDENCE_DESK_MODE=hosted
EXPOSE 4173
CMD ["node", "server.mjs"]
