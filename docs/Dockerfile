FROM python:3.11
ENV POETRY_VIRTUALENVS_CREATE=false
ENV POETRY_HOME="/opt/poetry"
ENV PATH="$POETRY_HOME/bin:$PATH"

RUN apt-get update && apt-get install -y curl
RUN curl -sSL https://install.python-poetry.org | python3 -

# Pin Poetry version

RUN poetry self update 1.4.0
COPY poetry.lock pyproject.toml ./
RUN poetry install

WORKDIR /app
CMD ["sphinx-autobuild", "--host", "0.0.0.0", "/app", "/app/_build"]
