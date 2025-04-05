from django.shortcuts import render

from rest_framework import viewsets
from .models import MerchantProfile, ConsumerProfile, LoyaltyProgram, LoyaltyToken, Voucher, \
    DonationClaim, MerchantProfile
from .serializers import (
    MerchantSerializer, ConsumerSerializer, LoyaltyProgramSerializer,
    LoyaltyTokenSerializer, VoucherSerializer, DonationClaimSerializer
)

class MerchantViewSet(viewsets.ModelViewSet):
    queryset = MerchantProfile.objects.all()
    serializer_class = MerchantSerializer

class ConsumerViewSet(viewsets.ModelViewSet):
    queryset = ConsumerProfile.objects.all()
    serializer_class = ConsumerSerializer

class LoyaltyProgramViewSet(viewsets.ModelViewSet):
    queryset = LoyaltyProgram.objects.all()
    serializer_class = LoyaltyProgramSerializer

class LoyaltyTokenViewSet(viewsets.ModelViewSet):
    queryset = LoyaltyToken.objects.all()
    serializer_class = LoyaltyTokenSerializer

class VoucherViewSet(viewsets.ModelViewSet):
    queryset = Voucher.objects.all()
    serializer_class = VoucherSerializer

class DonationClaimViewSet(viewsets.ModelViewSet):
    queryset = DonationClaim.objects.all()
    serializer_class = DonationClaimSerializer
