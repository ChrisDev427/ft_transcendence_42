from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile
#from game.serializers import GameSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'password', 'email', 'is_staff', 'is_active', 'date_joined', 'last_login']

class PublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class UserProfileSerializer(serializers.ModelSerializer):

    user = UserSerializer()
    #games_id = GameSerializer(many=True)

    class Meta:
        model = UserProfile
        fields = ['user', 'avatar', 'bio', 'games_id', 'win', 'lose', 'mobile_number', 'is_connected', 'is_ingame', 'friends', 'two_fa', ]

class UpdateAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['avatar']