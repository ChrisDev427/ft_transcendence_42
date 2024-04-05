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
		games = models.Game.objects.all()
		serializer = serializers.GameSerializer(games, many=True, context={'request': request})
		return Response(serializer.data)

	def post(self, request):
		serializer = serializers.GameSerializer(data=request.data, partial=True)
		if serializer.is_valid():
			player_one = serializer.validated_data['player_one']
			if player_one is None:
				return Response("player missing", status=status.HTTP_400_BAD_REQUEST)
			try:
				user1 = UserProfile.objects.get(user__username=player_one)
			except UserProfile.DoesNotExist:
				return Response("user does not exist", status=status.HTTP_400_BAD_REQUEST)
			game_type = serializer.validated_data['game_type']
			if game_type == "pvp" or game_type == "tournament":
				player_two = serializer.validated_data['player_two']
				if player_two is None:
					return Response("player missing", status=status.HTTP_400_BAD_REQUEST)
				elif player_one == player_two:
					return Response("same player", status=status.HTTP_400_BAD_REQUEST)
				try:
					user2 = UserProfile.objects.get(user__username=player_two)
				except UserProfile.DoesNotExist:
					return Response("user does not exist", status=status.HTTP_400_BAD_REQUEST) 
				existing_game = Game.objects.filter(player_one=user1, player_two=user2, winner=None)
				if existing_game:
						return Response("game already exist", status=status.HTTP_400_BAD_REQUEST)
			else:
				serializer.validated_data['player_two'] = None
				existing_game = Game.objects.filter(player_one=user1, winner=None)
				if existing_game:
					return Response("game already exist", status=status.HTTP_400_BAD_REQUEST)
			difficulty = serializer.validated_data['difficulty']
			if game_type is None or difficulty is None:
				return Response("missing game type or difficulty", status=status.HTTP_400_BAD_REQUEST)
			elif game_type != "ia" and game_type != "pvp" and game_type != "tournament":
				return Response("game type not valid", status=status.HTTP_400_BAD_REQUEST)
			elif difficulty != "easy" and difficulty != "medium" and difficulty != "hard":
				return Response("difficulty not valid", status=status.HTTP_400_BAD_REQUEST)
			serializer.validated_data['player_one'] = user1
			user1.is_ingame = True
			user1.save()
			if game_type != "ia":
				serializer.validated_data['player_two'] = user2
				user2.is_ingame = True
				user2.save()
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def score_validation(score):
	if score is None:
		return False
	elif score != format(score, 'd:d') :
		return False
	elif score[0] < 0 or score[1] < 0:
		return False
	elif score[0] > 10 or score[1] > 10:
		return False
	return True

class GameDetailView(APIView):

	permissions_classes = [IsAdminUser]

	def get_permissions(self):
		if self.request.method == 'GET':
			self.permission_classes = [permissions.IsAuthenticated]
		return super(GameDetailView, self).get_permissions()

	def get(self, request, id):
		game = models.Game.objects.get(id=id)
		if game is None:
			return Response("game does not exist", status=status.HTTP_400_BAD_REQUEST)
		serializer = serializers.GameSerializer(game, context={'request': request})
		return Response(serializer.data)

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
			winner = serializer.validated_data['winner']
			if winner is None:
				return Response("winner missing", status=status.HTTP_400_BAD_REQUEST)
			try :
				winner = UserProfile.objects.get(user__username=winner)
			except UserProfile.DoesNotExist:
				return Response("winner does not exist", status=status.HTTP_400_BAD_REQUEST)
			if winner != game_entries.player_one and winner != game_entries.player_two:
				return Response("winner is not a player", status=status.HTTP_400_BAD_REQUEST)
			try:
				score = serializer.validated_data['final_score']
			except KeyError:
				return Response("score missing", status=status.HTTP_400_BAD_REQUEST)
			if score is None:
				return Response("score missing", status=status.HTTP_400_BAD_REQUEST)
			# elif score != format(score, 'd:d') :
			# 	return Response("score is not valid", status=status.HTTP_400_BAD_REQUEST)
			serializer.validated_data['winner'] = winner
			serializer.save()
			user1 = get_object_or_404(models.UserProfile, pk = game_entries.player_one.pk)
			user1.games_id.add(id)
			if game_entries.game_type != "ia":
				user2 = get_object_or_404(models.UserProfile, pk = game_entries.player_two.pk)
				user2.games_id.add(id)
				if winner == user1:
					user1.win += 1
					user2.lose += 1
				else :
					user2.win += 1
					user1.lose += 1
				user2.is_ingame = False
				user2.save()
			else:
				if winner == user1:
					user1.win += 1
				else :
					user1.lose += 1
			user1.is_ingame = False
			user1.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)