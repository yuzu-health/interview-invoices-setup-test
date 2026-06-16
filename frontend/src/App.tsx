import { useEffect, useState } from "react";

type Widget = {
  id: number;
  name: string;
  count: number;
  createdAt: string | null;
};

export default function App() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/widgets");
      if (!res.ok) throw new Error(`GET /api/widgets -> ${res.status}`);
      setWidgets(await res.json());
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addWidget() {
    if (!name) return;
    await fetch("/api/widgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    load();
  }

  async function bump(w: Widget) {
    await fetch(`/api/widgets/${w.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: w.count + 1 }),
    });
    load();
  }

  async function remove(w: Widget) {
    await fetch(`/api/widgets/${w.id}`, { method: "DELETE" });
    load();
  }

  return (
    <main>
      <h1>Preflight check</h1>
      <p>
        If you can see widgets below, add one, bump its count, and delete it,
        then the frontend → <code>/api</code> → backend → SQLite path all works.
      </p>

      {error && (
        <p style={{ color: "crimson" }}>
          Could not reach the backend: {error}
          <br />
          Is it running on port 3001? (<code>npm run dev:node</code> or{" "}
          <code>npm run dev:python</code>)
        </p>
      )}

      <div style={{ display: "flex", gap: 8, margin: "1rem 0" }}>
        <input
          value={name}
          placeholder="new widget name"
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={addWidget}>Add</button>
      </div>

      <ul>
        {widgets.map((w) => (
          <li key={w.id} style={{ marginBottom: 6 }}>
            <strong>{w.name}</strong> — count {w.count}{" "}
            <button onClick={() => bump(w)}>+1</button>{" "}
            <button onClick={() => remove(w)}>delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
