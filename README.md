# Auth Frontend POC

This project now supports a modular Offer composition POC and two container workflows:

- Dev Containers for development.
- Docker Compose for production-style runtime verification.

## Dev Container Workflow

1. Open this folder in VS Code.
2. Run: Dev Containers: Reopen in Container.
3. In the container terminal run:

```bash
npm run dev -- --host 0.0.0.0
```

4. Open forwarded port 5173.

## Docker Runtime Workflow

Build and run the production-style container:

```bash
docker compose up --build
```

App URL:

- http://localhost:8080

## Modular Offer Composition (POC)

Offer modules are composed from an environment variable:

- `VITE_ENABLED_OFFERS`

Supported offer keys:

- `evqc`
- `chip-manufacturing`
- `esp-oil-rig`

Example:

```bash
VITE_ENABLED_OFFERS=evqc,esp-oil-rig npm run dev
```

For Windows PowerShell:

```powershell
$env:VITE_ENABLED_OFFERS="evqc,esp-oil-rig"; npm run dev
```

If `VITE_ENABLED_OFFERS` is missing or empty, all offers are included by default.

Use `.env.example` as a starter for local configuration.
