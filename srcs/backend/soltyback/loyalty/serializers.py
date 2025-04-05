from rest_framework import serializers
from .models import (
    MerchantProfile,
    ConsumerProfile,
    LoyaltyProgram,
    LoyaltyToken,
    Voucher,
    DonationClaim,
    MerchantProfile,
    ConsumerProfile,
)


class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = MerchantProfile
        fields = "__all__"


class ConsumerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsumerProfile
        fields = "__all__"


class LoyaltyProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoyaltyProgram
        fields = "__all__"


class LoyaltyTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoyaltyToken
        fields = "__all__"


class VoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voucher
        fields = "__all__"


class DonationClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationClaim
        fields = "__all__"
