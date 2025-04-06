FROM python:3.12-alpine AS base

ARG S6_OVERLAY_VERSION=3.2.0.2
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    CARGO_TARGET_DIR=/build/target \
    RUSTFLAGS="-C target-feature=-crt-static" \
    OPENSSL_ia32cap="~0x2000000000000000" \
    OPENSSL_ia32cap="~0x2000000000000000"

# Builder stage
FROM base AS builder
WORKDIR /build

# Install build tools
RUN apk add --no-cache \
    rust \
    cargo \
    maturin \
    build-base \
    openssl-dev \
    musl-dev \
    git \
    zlib-dev \
    libffi-dev \
    python3-dev \
    perl \
    perl-dev

# Copy UV executable
COPY --from=ghcr.io/astral-sh/uv:0.6.12 /uv /bin/uv

# Create virtual environment
RUN python -m venv /venv

# Install base dependencies
COPY srcs/backend/soltyback/pyproject.toml /build/
RUN /venv/bin/pip install --no-cache-dir \
    django \
    djangorestframework

# Install web server dependencies
RUN /venv/bin/pip install --no-cache-dir \
    gunicorn \
    daphne

# Install other dependencies
RUN /venv/bin/pip install --no-cache-dir \
    cryptography \
    pillow

# Install project dependencies
COPY srcs/backend/soltyback /build/
RUN /venv/bin/pip install --no-cache-dir setuptools>=40.8.0 && \
    uv pip install --no-cache-dir -e . --target /venv/lib/python3.12/site-packages

# Runtime stage
FROM base
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache \
    netcat-openbsd \
    libstdc++ \
    s6 \
    s6-rc \
    xz

# Copy virtual environment and application code
COPY --from=builder /venv /venv
COPY srcs/backend/soltyback /app/

# Copy S6 overlay
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz \
    https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-x86_64.tar.xz \
    /tmp/
    
RUN tar -C / -Jxpf /tmp/s6-overlay-noarch.tar.xz && \
    tar -C / -Jxpf /tmp/s6-overlay-x86_64.tar.xz && \
    rm /tmp/s6-overlay-*.tar.xz

# Copy S6 service configurations
COPY containers/django/config/s6 /etc/s6-overlay/s6-rc.d/
RUN chmod +x /etc/s6-overlay/s6-rc.d/daphne/run && \
    chmod +x /etc/s6-overlay/s6-rc.d/gunicorn/run

# Copy entrypoint script
COPY containers/django/entrypoint.sh /tmp/entrypoint.sh
RUN chmod +x /tmp/entrypoint.sh

# Set environment variables
ENV PATH="/venv/bin:$PATH"
ENV DJANGO_SETTINGS_MODULE=soltyback.settings

# Set default command
ENTRYPOINT ["/bin/sh", "/tmp/entrypoint.sh"]
CMD ["gunicorn", "soltyback.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]

# Expose port
EXPOSE 8000
