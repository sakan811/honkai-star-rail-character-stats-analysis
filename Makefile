run:
	python main.py

lint:
	ruff check . --fix --unsafe-fixes

format:
	ruff format .

ruff: lint format