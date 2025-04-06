FROM python:3.12-alpine

ARG S6_OVERLAY_VERSION=3.2.0.2
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV DJANGO_SETTINGS_MODULE=soltyback.settings

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
    python3-dev \
    netcat-openbsd \
    xz \
    s6 \
    s6-rc

# Set working directory
WORKDIR /app

# Copy pyproject.toml first
COPY srcs/backend/soltyback/pyproject.toml /app/

# Install uv package manager
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Install base Python dependencies first
RUN echo "=== Installing base Python dependencies ===" && \
    pip install --no-cache-dir \
    django \
    djangorestframework \
    cryptography \
    pillow \
    gunicorn \
    daphne

# Install project dependencies
RUN echo "=== Installing project dependencies ===" && \
    timeout 300 uv pip install --system --no-cache-dir -e .

# Install S6 overlay for service management
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-noarch.tar.xz && rm /tmp/s6-overlay-noarch.tar.xz

ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-x86_64.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-x86_64.tar.xz && rm /tmp/s6-overlay-x86_64.tar.xz

# Copy S6 service configurations
COPY containers/django/config/s6 /etc/s6-overlay/s6-rc.d/
RUN chmod +x /etc/s6-overlay/s6-rc.d/daphne/run && \
    chmod +x /etc/s6-overlay/s6-rc.d/gunicorn/run

# Copy application code
COPY srcs/backend/soltyback /app/

# Copy the external entrypoint script instead of creating it in the Dockerfile
COPY containers/django/entrypoint.sh /tmp/entrypoint.sh
RUN chmod +x /tmp/entrypoint.sh

# Set the entrypoint script
ENTRYPOINT ["/bin/sh", "/tmp/entrypoint.sh"]

# Default command: Run with gunicorn
CMD ["python", "-m", "gunicorn", "soltyback.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]

# Expose port
EXPOSE 8000
