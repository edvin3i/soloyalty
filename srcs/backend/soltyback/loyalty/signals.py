from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import ConsumerProfile  # или MerchantProfile, если нужно


@receiver(post_save, sender=User)
def create_consumer_profile(sender, instance, created, **kwargs):
    if created:
        # В данном случае мы создаем профиль потребителя по умолчанию.
        ConsumerProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_consumer_profile(sender, instance, **kwargs):
    instance.consumer_profile.save()
