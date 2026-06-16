import { Router } from "express";
import { prisma } from "./db.js";

const router = Router();

// GET /api/widgets — list all widgets
router.get("/widgets", async (_req, res) => {
  const widgets = await prisma.widget.findMany({ orderBy: { id: "asc" } });
  res.json(widgets);
});

// POST /api/widgets — create a widget { name, count? }
router.post("/widgets", async (req, res) => {
  const { name, count } = req.body ?? {};
  if (typeof name !== "string" || name.length === 0) {
    res.status(400).json({ error: "name is required" });
    return;
  }
  const widget = await prisma.widget.create({
    data: { name, count: typeof count === "number" ? count : 0 },
  });
  res.status(201).json(widget);
});

// PATCH /api/widgets/:id — update name and/or count
router.patch("/widgets/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, count } = req.body ?? {};
  const widget = await prisma.widget.update({
    where: { id },
    data: {
      ...(typeof name === "string" ? { name } : {}),
      ...(typeof count === "number" ? { count } : {}),
    },
  });
  res.json(widget);
});

// DELETE /api/widgets/:id
router.delete("/widgets/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.widget.delete({ where: { id } });
  res.status(204).end();
});

export default router;
