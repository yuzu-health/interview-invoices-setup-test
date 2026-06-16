# Preflight check

A tiny standalone repo that exercises the **exact same toolchain** as the
invoicing interview — Node (Express + Prisma + SQLite) or Python (FastAPI +
SQLAlchemy + SQLite), plus the shared Vite/React frontend and its `/api` proxy —
with nothing but trivial CRUD on a `Widget` table. No interview logic.

**If you can get this running, the interview repo will run too.** Use it to sort
out environment issues (Node/Python versions, installs, Prisma client
generation, ports) before the interview starts.

Pick **one** backend. All commands run from the repo root.

## Node

```bash
npm install                            # root tooling (concurrently)
npm install --prefix frontend          # frontend deps
npm install --prefix backend/node      # backend deps + generates the Prisma client
npm run seed:node                      # create + seed the SQLite db
npm run test:node                      # run the test suite
npm run dev:node                       # start backend (:3001) + frontend (:5173)
```

## Python

```bash
npm install                                       # root tooling (concurrently)
npm install --prefix frontend                     # frontend deps
pip3 install -r backend/python/requirements.txt   # backend deps
npm run seed:python                               # create + seed the SQLite db
npm run test:python                               # run the test suite
npm run dev:python                                # start backend (:3001) + frontend (:5173)
```

## What "working" looks like

Open http://localhost:5173. You should see three seeded widgets. Add one, bump
its count, and delete it — each action round-trips through `/api` to the backend
and SQLite. You can also hit the API directly:

```bash
curl http://localhost:3001/api/widgets
curl -X POST http://localhost:3001/api/widgets \
  -H 'Content-Type: application/json' -d '{"name":"test"}'
```

---

Notes:
- `vite` is a local dependency of `frontend/` — no global install needed.
- `npm run dev:*` runs the backend and frontend together via `concurrently`.
- The `*.db` files and the generated Prisma client are gitignored; `seed` and
  `npm install` regenerate them.
