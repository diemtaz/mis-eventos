FROM python:3.12-slim

WORKDIR /code

ENV PYTHONPATH=/code

COPY pyproject.toml poetry.lock* /code/

RUN pip install poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-root

RUN touch /code/test.db && chmod 777 /code/test.db

COPY . /code

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
