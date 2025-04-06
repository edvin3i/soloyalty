from rest_framework.routers import DefaultRouter
from loyalty.views import (
    MerchantViewSet, ConsumerViewSet, LoyaltyProgramViewSet,
    LoyaltyTokenViewSet, VoucherViewSet, DonationClaimViewSet
)
from django.urls import path, include
from .views import PrivyLoginView

router = DefaultRouter()
router.register(r'merchants', MerchantViewSet)
router.register(r'consumers', ConsumerViewSet)
router.register(r'programs', LoyaltyProgramViewSet)
router.register(r'tokens', LoyaltyTokenViewSet)
router.register(r'vouchers', VoucherViewSet)
router.register(r'donations', DonationClaimViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/privy-login/', PrivyLoginView.as_view(), name='privy_login'),
]
