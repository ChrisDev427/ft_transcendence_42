from django.contrib.auth.models import User
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from .models import UserProfile
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from django.http import HttpResponse
from django.core.files.storage import default_storage
from rest_framework.parsers import MultiPartParser
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from .utils import *

import pyotp, uuid, os


class UserRegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            email = str.lower(serializer.validated_data.get('email'))
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
                is_active=False,
            )
            user_profile = UserProfile.objects.create(user=user)
            user_profile.otp = uuid.uuid4().hex
            user_profile.save()
            send_mail(
            'NO-REPLY:Verify your mail address',
            f'Click to verify: {settings.SITE_URL + "#verify-email?token=" + user_profile.otp}',
            os.environ.get('EMAIL_HOST_USER'),
            [user.email],
            fail_silently=False,
)
            return Response("User created", status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.GET.get('token', None)
        user_profile = get_object_or_404(UserProfile, otp=token)
        user_profile.user.is_active = True
        user_profile.user.save()
        user_profile.otp = None
        user_profile.save()
        return Response("Email verified", status=status.HTTP_200_OK)

class AllUserView(APIView):
    permission_classes = [permissions.IsAdminUser]
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class UserView(APIView):
    def get(self, request, pk):
        user = User.objects.get(pk=pk)
        serializer = PublicUserSerializer(user)
        return Response(serializer.data)

class ProfileView(APIView):

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
        user_profile = UserProfile.objects.filter(user=user).first()
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
        user_profile = UserProfile.objects.filter(user=user).first()
        if user_profile:
            user_profile.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)

class getProfileView(APIView):
    def get(self, request, username):
        user_profile = get_object_or_404(UserProfile, user__username=username)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)


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
            elif not user.is_active:
                return Response({"message:","email not verified"}, status=status.HTTP_401_UNAUTHORIZED)
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
            profile_serializer = UserProfileSerializer(user_profile, context={'request': request})
        return Response({**response.data, **profile_serializer.data}, status=status.HTTP_200_OK)

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
