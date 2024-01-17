from rest_framework import serializers
from .models import Game

class GameSerializer(serializers.ModelSerializer):
	class Meta:
		model = Game
		fields = ['id', 'player_one', 'player_two', 'final_score', 'winner', 'created_at', 'updated_at']