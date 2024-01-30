from rest_framework import serializers
from .models import Friend


class FriendSerializer(serializers.ModelSerializer):
	class Meta:
		model = Friend
		fields = ['id', 'friend1', 'friend2','requester', 'is_accepted', 'chat']