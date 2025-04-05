FROM python:3.12-alpine

ARG S6_OVERLAY_VERSION=3.2.0.2

# Install Rust and build tools
RUN apk add --no-cache \
    rust \
    cargo \
    maturin \
    build-base \
    openssl-dev \
    musl-dev \
    git \
    perl \
    zlib-dev \
    libffi-dev \
    python3-dev

# Copy pyproject.toml first
COPY ../../srcs/backend/soltyback/pyproject.toml .

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Install Python dependencies without Solana first
RUN uv sync --no-cache \
    && uv remove solana \
    && uv remove black

# Install Solana separately with pre-built wheels
RUN pip install --no-cache-dir \
    solana==0.36.6 \
    black==25.1.0

RUN apk update && apk upgrade && apk add xz s6 s6-rc
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-noarch.tar.xz
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-x86_64.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-x86_64.tar.xz

COPY containers/django/config/s6 /etc/s6-overlay/s6-rc.d/
RUN chmod +x /etc/s6-overlay/s6-rc.d/daphne/run && \
    chmod +x /etc/s6-overlay/s6-rc.d/gunicorn/run

WORKDIR /app
ADD ../../srcs/backend/soltyback /app

COPY containers/django/entrypoint.sh /tmp/entrypoint.sh

RUN uv sync --no-cache

ENTRYPOINT [ "sh", "/tmp/entrypoint.sh" ]

CMD ["uv", "run", "gunicorn", "-b", "0.0.0.0:8000", "soltyback.wsgi"]
