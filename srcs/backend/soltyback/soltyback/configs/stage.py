from .base import *

DEBUG = True

ALLOWED_HOSTS = [
    "django",
    "localhost",
]

# CSRF Trusted Origins
CSRF_TRUSTED_ORIGINS = [
    "https://localhost:4443",
    "https://localhost",
    "https://gbreana.42.fr",
]

try:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("DB_NAME"),
            "USER": os.getenv("DB_USER"),
            "PASSWORD": os.getenv("DB_PASSWORD"),
            "HOST": os.getenv("DB_HOST"),
            "PORT": os.getenv("DB_PORT"),
        }
    }
except KeyError as e:
    raise RuntimeError("Could not find a some DB parameter in environment") from e

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"].append(
    "rest_framework.renderers.BrowsableAPIRenderer"
)
