from contextlib import asynccontextmanager
from typing import Any

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import engine, SessionLocal
from models import Base, Widget


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def serialize(w: Widget) -> dict[str, Any]:
    return {
        "id": w.id,
        "name": w.name,
        "count": w.count,
        "createdAt": w.createdAt.isoformat() if w.createdAt else None,
    }


@app.get("/api/widgets")
def list_widgets() -> list[dict[str, Any]]:
    db = SessionLocal()
    try:
        widgets = db.query(Widget).order_by(Widget.id.asc()).all()
        return [serialize(w) for w in widgets]
    finally:
        db.close()


@app.post("/api/widgets", status_code=201)
def create_widget(payload: dict[str, Any]) -> dict[str, Any]:
    name = payload.get("name")
    if not isinstance(name, str) or not name:
        raise HTTPException(status_code=400, detail="name is required")
    count = payload.get("count")
    db = SessionLocal()
    try:
        widget = Widget(name=name, count=count if isinstance(count, int) else 0)
        db.add(widget)
        db.commit()
        db.refresh(widget)
        return serialize(widget)
    finally:
        db.close()


@app.patch("/api/widgets/{widget_id}")
def update_widget(widget_id: int, payload: dict[str, Any]) -> dict[str, Any]:
    db = SessionLocal()
    try:
        widget = db.get(Widget, widget_id)
        if widget is None:
            raise HTTPException(status_code=404, detail="not found")
        if isinstance(payload.get("name"), str):
            widget.name = payload["name"]
        if isinstance(payload.get("count"), int):
            widget.count = payload["count"]
        db.commit()
        db.refresh(widget)
        return serialize(widget)
    finally:
        db.close()


@app.delete("/api/widgets/{widget_id}", status_code=204)
def delete_widget(widget_id: int) -> None:
    db = SessionLocal()
    try:
        widget = db.get(Widget, widget_id)
        if widget is not None:
            db.delete(widget)
            db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3001)
