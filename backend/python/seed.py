from database import engine, SessionLocal
from models import Base, Widget


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        db.query(Widget).delete()
        db.add_all([
            Widget(name="alpha", count=1),
            Widget(name="beta", count=2),
            Widget(name="gamma", count=3),
        ])
        db.commit()
        total = db.query(Widget).count()
        print(f"Seeded {total} widgets.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
