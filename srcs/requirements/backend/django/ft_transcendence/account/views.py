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
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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
        user_profile = UserProfile.objects.filter(user=user).first()  # Obtenez le profil de l'utilisateur
        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
            return Response(serializer.data)
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


class LoginView(TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            username = request.data.get('username')
            password = request.data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                user_profile = UserProfile.objects.filter(user=user).first()
                if user_profile:
                    user_profile.is_connected = True
                    user_profile.save()
        return response

class LogoutView(APIView):
    def get(self, request):
        user = request.user
        user_profile = UserProfile.objects.filter(user=user).first()
        user_profile.is_connected = False
        user_profile.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

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