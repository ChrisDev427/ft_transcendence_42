from rest_framework import serializers
from .models import Game
from account.models import UserProfile

class GameSerializer(serializers.ModelSerializer):
	class Meta:
		model = Game
		fields = ['id', 'player_one', 'player_two', 'final_score', 'game_type', 'difficulty', 'winner', 'created_at', 'updated_at']

class GameSerializer(serializers.ModelSerializer):
	player_one = serializers.CharField(max_length=150)
	player_two = serializers.CharField(max_length=150)
	winner = serializers.CharField(max_length=150, required=False)

	class Meta:
		model = Game
		fields = ['id', 'player_one', 'player_two', 'final_score', 'game_type', 'difficulty', 'winner', 'created_at', 'updated_at']

	def validate_player(self, value):
		try:
			user = UserProfile.objects.get(username=value)
		except UserProfile.DoesNotExist:
			raise serializers.ValidationError("Player one does not exist")

		return value