FROM node:22-alpine

WORKDIR /app
COPY . .

# install the thin server deps
WORKDIR /app/server
RUN npm install --omit=dev --no-audit --no-fund

# the pack (skills/templates/config) lives at the repo root
ENV RELAY_ROOT=/app

# default: run the MCP server over stdio (use `docker run -i --rm relay`).
# CLI: `docker run --rm relay list` / `... show supervisor` / `... score`.
ENTRYPOINT ["node", "/app/server/cli.mjs"]
CMD ["mcp"]
