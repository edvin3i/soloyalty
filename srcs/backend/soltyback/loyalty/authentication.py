from os import getenv

import requests
from rest_framework import authentication, exceptions
from django.contrib.auth.models import User
from .models import ConsumerProfile, MerchantProfile

class PrivyAuthentication(authentication.BaseAuthentication):
    """

    """

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        auth_parts = auth_header.split()
        if len(auth_parts) != 2 or auth_parts[0].lower() != 'bearer':
            return None

        privy_token = auth_parts[1]

        privy_api_url = getenv("OA_AUTH_ENDPOINT", "https://api.privy.io/v1/authenticate")
        privy_api_key = getenv("OA_SECRET", None)
        if not privy_api_key:
            raise exceptions.AuthenticationFailed("Privy API key doesn't exist")

        # create the request to Privy API
        headers = {
            "Authorization": f"Bearer {privy_api_key}",
            "Content-Type": "application/json",
        }
        payload = {"token": privy_token}

        try:
            response = requests.post(privy_api_url, json=payload, headers=headers, timeout=5)
        except requests.RequestException as e:
            raise exceptions.AuthenticationFailed(f"Connection error to Privy: {str(e)}")

        if response.status_code != 200:
            raise exceptions.AuthenticationFailed("Validation error Privy")

        data = response.json()
        user_info = data.get("user")
        if not user_info:
            raise exceptions.AuthenticationFailed("Wrong answer from Privy API")

        email = user_info.get("email")
        if not email:
            raise exceptions.AuthenticationFailed("Email does not provided by Privy")

        # i guess the user has the "role" field
        role = user_info.get("role", "consumer").lower()  # by default it is consumer
        name = user_info.get("name", "")
        phone = user_info.get("phone", "")
        company = user_info.get("company", "") # for merchant
        privy_id = user_info.get("id", "")  # unique id from Privy

        # Поиск или создание пользователя по email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = User.objects.create(username=email, email=email)


        # update users profiles depends on roles
        if role == "merchant":
            # if merchant profile is exist - update it in other way create
            if hasattr(user, 'merchant_profile'):
                merchant_profile = user.merchant_profile
                # update data if it changed
                if company and merchant_profile.company_name != company:
                    merchant_profile.company_name = company
                if phone and merchant_profile.phone != phone:
                    merchant_profile.phone = phone
                merchant_profile.save()
            else:
                MerchantProfile.objects.create(user=user, company_name=company, phone=phone)
        else:  # consumer
            if hasattr(user, 'consumer_profile'):
                consumer_profile = user.consumer_profile
                if phone and consumer_profile.phone != phone:
                    consumer_profile.phone = phone
                if privy_id and consumer_profile.privy_id != privy_id:
                    consumer_profile.privy_id = privy_id
                consumer_profile.save()
            else:
                ConsumerProfile.objects.create(user=user, phone=phone, privy_id=privy_id)

        # return user and his token
        return (user, privy_token)
