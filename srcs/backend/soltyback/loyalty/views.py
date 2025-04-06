from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, exceptions
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .authentication import PrivyAuthentication
from rest_framework import viewsets
from loyalty.models import MerchantProfile, ConsumerProfile, LoyaltyProgram, LoyaltyToken, Voucher, \
    DonationClaim, MerchantProfile
from loyalty.serializers import (
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


class PrivyLoginView(APIView):
    """
    """
    authentication_classes = []
    def post(self, request, *args, **kwargs):
        privy_token = request.data.get("privy_token")
        if not privy_token:
            return Response({"detail": "privy_token is obligatory."}, status=status.HTTP_400_BAD_REQUEST)

        # call custom authentication backend
        authenticator = PrivyAuthentication()
        try:
            user, _ = authenticator.authenticate(request._request)
        except exceptions.AuthenticationFailed as e:
            return Response({"detail": str(e)}, status=status.HTTP_401_UNAUTHORIZED)

        if not user:
            return Response({"detail": "Auth is failed."}, status=status.HTTP_401_UNAUTHORIZED)

        # generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_200_OK)
