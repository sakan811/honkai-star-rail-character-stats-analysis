run:
	python main.py

lint:
	ruff check . --fix --unsafe-fixes

format:
	ruff format .

mypy:
	mypy . --strict --ignore-missing-imports

qa: lint format mypy

test:
	python -m pytest tests