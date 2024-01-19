from django.contrib.auth.models import User
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, UserProfileSerializer, UpdateAvatarSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import UserProfile
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse
from rest_framework_simplejwt.views import TokenObtainPairView
from django.http import HttpResponse
from django.core.files.storage import default_storage
from rest_framework.parsers import MultiPartParser
from django.utils import timezone
from django.core.mail import send_mail
import random, os
from twilio.rest import Client

import pyotp

def enable_2fa_authenticator(user_profile):
    user_profile.totp_secret = pyotp.random_base32()
    user_profile.save()
    return user_profile.totp_secret

def get_totp_uri(user_profile):
    totp = pyotp.TOTP(user_profile.totp_secret)
    return totp.provisioning_uri(user_profile.user.email, issuer_name="Pong_42")

def verify_twilio_otp(user_profile, submitted_code):
        account_sid = os.environ.get('TWILIO_SID')
        auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
        client = Client(account_sid, auth_token)
        verification_check = client.verify.v2.services(os.environ.get('TWILIO_SERVICE_SID')).verification_checks.create(
        to=user_profile.mobile_number,
        code=submitted_code
        )
        if verification_check.status == 'approved':
         return True  # Le code OTP est correct
        else:
         return False  # Le code OTP est incorrect

class UserRegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            if User.objects.filter(email=email).exists():
                return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)
            elif email == None:
                return Response({"error": "Email needed"}, status=status.HTTP_400_BAD_REQUEST)
            user = User.objects.create_user(
                username = serializer.validated_data.get('username'),
                password = serializer.validated_data.get('password'),
                first_name = serializer.validated_data.get('first_name'),
                last_name = serializer.validated_data.get('last_name'),
                email=email,
            )
            UserProfile.objects.create(user=user)
            return Response("User created", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AllUserView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class UserView(APIView):
    def get(self, request, pk):
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

class ProfileView(APIView):

    # def get_permissions(self):
    #     if self.request.method == 'GET':
    #         return [permissions.AllowAny()]
    #     return [permissions.IsAuthenticated()]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user_profile = UserProfile.objects.filter(user=user).first()
        serializer = UserProfileSerializer(user_profile, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        if request.data.get('password'):
            user.set_password(request.data.get('password'))
            user.save()
            return Response("password updated", status=status.HTTP_200_OK)
        user_profile = UserProfile.objects.filter(user=user).first()  # Obtenez le profil de l'utilisateur
        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
            if request.data.get('two_fa'):
                user_profile.totp_secret = enable_2fa_authenticator(user_profile)
                user_profile.two_fa = True
                user_profile.save()
            return Response("user updated", status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user = request.user
        user_profile = UserProfile.objects.filter(user=user).first()  # Obtenez le profil de l'utilisateur
        if user_profile:
            user_profile.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)

class getProfileView(APIView):
    def get(self, request, username):
        user_profile = get_object_or_404(UserProfile, user__username=username)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)

def send_otp(string, user_profile):
    if string == 'email':
        verification_code = "".join([str(random.randint(0, 9)) for i in range(6)])
        send_mail(
            'OTP',
            'Your OTP is ' + verification_code,
            os.environ.get('EMAIL_HOST_USER'),
            [user_profile.user.email],
            fail_silently=False,
        )
        return verification_code
    elif string == 'sms':
        account_sid = os.environ.get('TWILIO_SID')
        auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
        service_sid = os.environ.get('TWILIO_SERVICE_SID')
        client = Client(account_sid, auth_token)

        verification = client.verify.services(service_sid).verifications.create(
            to=user_profile.mobile_number,
            channel='sms'
        )
        return verification.sid
    elif string == 'application':
        return '0'

class SendOTPView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        send_method = request.data.get('send_method')
        if not username or not password or not send_method:
            return Response({"error:","username, password and send_method needed"}, status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(username=username, password=password)
        try :
            user_profile = UserProfile.objects.filter(user=user).first()
        except UserProfile.DoesNotExist:
            return Response({"message:","user not found"}, status=status.HTTP_404_NOT_FOUND)
        user_profile.otp = str()
        user_profile.otp = send_otp(send_method, user_profile)
        if user_profile.otp == None:
            return Response({"error:","send method"}, status=status.HTTP_400_BAD_REQUEST)
        elif user_profile.otp == '0':
            return Response(get_totp_uri(user_profile), status=status.HTTP_200_OK)
        user_profile.opt_expiration = timezone.now() + timezone.timedelta(minutes=5)
        user_profile.save()
        return Response({'detail': 'Verification code sent successfully.'}, status=status.HTTP_204_NO_CONTENT)

class LoginView(TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            username = request.data.get('username')
            password = request.data.get('password')
            otp = request.data.get('otp')
            totp = request.data.get('totp')
            user = authenticate(username=username, password=password)
            if user is None:
                return Response(status=status.HTTP_404_NOT_FOUND)
            try:
                user_profile = UserProfile.objects.filter(user=user).first()
            except UserProfile.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            if user_profile.two_fa:
                if not user_profile.otp:
                    return Response({"message:","otp needed"}, status=status.HTTP_401_UNAUTHORIZED)
                if totp:
                    totp_secret = pyotp.TOTP(user_profile.totp_secret)
                    if not totp_secret.verify(totp):
                        return Response({"message:","totp not match"}, status=status.HTTP_401_UNAUTHORIZED)
                elif not otp:
                    return Response({"message:","otp needed"}, status=status.HTTP_401_UNAUTHORIZED)
                elif user_profile.opt_expiration < timezone.now():
                    return Response({"message:","otp expired"}, status=status.HTTP_401_UNAUTHORIZED)
                elif user_profile.otp == otp or verify_twilio_otp(user_profile, otp):
                    user_profile.otp = None
            user_profile.is_connected = True
            user_profile.save()
        return response

class LogoutView(APIView):
    def get(self, request):
        user = request.user
        try:
         user_profile = UserProfile.objects.filter(user=user).first()
        except UserProfile.DoesNotExist:
            return Response("no user connected", status=status.HTTP_404_NOT_FOUND)
        user_profile.is_connected = False
        user_profile.save()
        return Response("user logout", status=status.HTTP_204_NO_CONTENT)

class isIngame(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def put(self, request):
        user = request.user
        user_profile = UserProfile.objects.filter(user=user).first()
        if user_profile.is_ingame:
            user_profile.is_ingame = False
        else:
            user_profile.is_ingame = True
        user_profile.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AvatarView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get (self, request, avatar):
        try:
            user = request.user
            user_profile = UserProfile.objects.get(user=user)
            if user_profile.avatar:
                image_path = 'account/avatar/' + user_profile.avatar.name.split('/')[-1]
                with default_storage.open(image_path, 'rb') as image_file:
                    image_data = image_file.read()
                image_extension = avatar.split('.')[-1]
                return HttpResponse(image_data, content_type='image/' + image_extension)
            else:
                return HttpResponse(status=404)
        except UserProfile.DoesNotExist:
            return HttpResponse(status=404)

class UpdateAvatarView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]
    allowed_methods = ['PUT']

    def put(self, request):
        user_profile = request.user.userprofile
        serializer = UpdateAvatarSerializer(user_profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors ,status=status.HTTP_400_NO_CONTENT)