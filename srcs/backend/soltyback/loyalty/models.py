from django.db import models
from django.contrib.auth.models import User


class MerchantProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="merchant_profile"
    )
    company_name = models.CharField(max_length=255, verbose_name="Название компании")
    address = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Merchant Profile: {self.user.username} ({self.company_name})"


class ConsumerProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="consumer_profile"
    )
    phone = models.CharField(max_length=20, blank=True, null=True)
    # additional fields Privy
    privy_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Consumer Profile: {self.user.username}"


class LoyaltyProgram(models.Model):
    merchant = models.ForeignKey(
        MerchantProfile, on_delete=models.CASCADE, related_name="programs"
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    accrual_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class LoyaltyToken(models.Model):
    program = models.ForeignKey(
        LoyaltyProgram, on_delete=models.CASCADE, related_name="tokens"
    )
    name = models.CharField(max_length=100)
    conversion_rate = models.DecimalField(
        max_digits=10, decimal_places=2, help_text="Курс к SLL"
    )
    allow_p2p = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Voucher(models.Model):
    merchant = models.ForeignKey(
        MerchantProfile, on_delete=models.CASCADE, related_name="vouchers"
    )
    token = models.ForeignKey(
        LoyaltyToken, on_delete=models.CASCADE, related_name="vouchers"
    )
    nft_identifier = models.CharField(max_length=255, unique=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    price_in_token = models.DecimalField(max_digits=10, decimal_places=2)
    is_redeemed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Voucher {self.nft_identifier}"


class DonationClaim(models.Model):
    consumer = models.ForeignKey(
        ConsumerProfile, on_delete=models.CASCADE, related_name="donations"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    is_claimed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Donation Claim {self.id}"
