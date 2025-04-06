from .base import *

DEBUG = True

ALLOWED_HOSTS = [
    "django",
    "localhost",
    "127.0.0.1",
]

# CSRF Trusted Origins
CSRF_TRUSTED_ORIGINS = [
    "https://localhost",
    "https://soloyalty.ibondar.pro",
]


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"].append(
    "rest_framework.renderers.BrowsableAPIRenderer"
)
