from rest_framework import serializers
from .models import Game
from account.models import UserProfile

class GameSerializer(serializers.ModelSerializer):
	player_one = serializers.SerializerMethodField()
	player_two = serializers.SerializerMethodField()
	winner = serializers.SerializerMethodField()

	class Meta:
		model = Game
		fields = ['id', 'player_one', 'player_two', 'final_score', 'game_type', 'difficulty', 'winner', 'created_at', 'updated_at']

	def validate_player(self, value):
		try:
			user = UserProfile.objects.get(username=value)
		except UserProfile.DoesNotExist:
			raise serializers.ValidationError("Player one does not exist")
		return value

	def get_player_username(self, obj, player_field):
		user = getattr(obj, player_field).user
		return user.username if user else None

	def get_player_one(self, obj):
		return self.get_player_username(obj, 'player_one')

	def get_player_two(self, obj):
		return self.get_player_username(obj, 'player_two')

	def get_winner(self, obj):
		return self.get_player_username(obj, 'winner')