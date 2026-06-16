def next_count(current: int, delta: int) -> int:
    return current + delta


def test_toolchain_runs():
    # A trivial pure-logic test so `npm run test:python` exercises pytest
    # without touching the database. If this runs, the test toolchain works.
    assert next_count(2, 3) == 5
