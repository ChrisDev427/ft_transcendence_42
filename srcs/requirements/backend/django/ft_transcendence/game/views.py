from django.shortcuts import render
from . import models, serializers
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from django.shortcuts import get_object_or_404
from account.models import UserProfile
from .models import Game

class GameView(APIView):

	permissions_classes = [IsAdminUser]

	def get(self, request):
		game_entries = models.Game.objects.filter(id=id)
		serializer = serializers.GameSerializer(game_entries, many=True, context={'request': request})
		if serializer.is_valid():
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def post(self, request):
		serializer = serializers.GameSerializer(data=request.data)
		if serializer.is_valid():
			player_one = serializer.validated_data['player_one']
			player_two = serializer.validated_data['player_two']
			if player_one is None or player_two is None:
				return Response("player missing", status=status.HTTP_400_BAD_REQUEST)
			elif player_one == player_two:
				return Response("same player", status=status.HTTP_400_BAD_REQUEST)
			existing_game = Game.objects.filter(player_one=player_one, player_two=player_two)
			if existing_game:
				if existing_game.winner is None:
					return Response("game already exist", status=status.HTTP_400_BAD_REQUEST)
			try :
				user1 = UserProfile.objects.get(user=serializer.validated_data['player_one'])
				user2 = UserProfile.objects.get(user=serializer.validated_data['player_two'])
			except UserProfile.DoesNotExist:
				return Response("user does not exist", status=status.HTTP_400_BAD_REQUEST)
			user1.is_ingame = True
			user2.is_ingame = True
			user1.save()
			user2.save()
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def patch(self, request, id):
		get_object_or_404(models.Game, pk = id)
		game_entries = models.Game.objects.get(id=id)
		if game_entries.winner is not None:
			return Response("game already finished", status=status.HTTP_400_BAD_REQUEST)
		try:
			serializer = serializers.GameSerializer(game_entries, data=request.data, partial=True, context= { id : get_object_or_404(models.Game, pk = id)})
		except serializers.GameSerializer.DoesNotExist:
			return Response("game does not exist", status=status.HTTP_400_BAD_REQUEST)
		if serializer.is_valid():
			try:
				winner = serializer.validated_data['winner']
			except KeyError:
				return Response("winner missing", status=status.HTTP_400_BAD_REQUEST)
			if winner is None:
				return Response("winner missing", status=status.HTTP_400_BAD_REQUEST)
			elif winner != game_entries.player_one and winner != game_entries.player_two:
				return Response("winner is not a player", status=status.HTTP_400_BAD_REQUEST)
			try:
				score = serializer.validated_data['final_score']
			except KeyError:
				return Response("score missing", status=status.HTTP_400_BAD_REQUEST)
			if score is None:
				return Response("score missing", status=status.HTTP_400_BAD_REQUEST)
			# elif score != format(score, 'd:d'):
			# 	return Response("score is not valid", status=status.HTTP_400_BAD_REQUEST)
			serializer.save()
			user1 = UserProfile.objects.get(user=game_entries.player_one)
			user1.games_id.add(id)
			user2 = UserProfile.objects.get(user=game_entries.player_one)
			user2.games_id.add(id)
			if winner == user1:
				user1.win += 1
			else :
				user2.lose += 1
			user1.is_ingame = False
			user2.is_ingame = False
			user1.save()
			user2.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)