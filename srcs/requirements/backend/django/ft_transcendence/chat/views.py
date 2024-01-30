from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Chat
from .serializers import ChatSerializer, MessageSerializer
from rest_framework.permissions import IsAuthenticated
from account.models import UserProfile
from friend_management.models import Friend_management

class ChatView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, format=None):
		user1 = request.GET.get('user1')
		user2 = request.GET.get('user2')
		if user1 is None or user2 is None:
			return Response({ "error :", "specify users" } , status=status.HTTP_400_BAD_REQUEST)
		if request.user is not user1 and request.user is not user2:
			return Response({ "error :", "you are not in this chat" } , status=status.HTTP_403_FORBIDDEN)
		try:
			chat = Chat.objects.get(user1=user1, user2=user2)
		except Chat.DoesNotExist:
			return Response({"error", "chat not exist"}, status=status.HTTP_404_NOT_FOUND)
		serializer = ChatSerializer(chat, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)


class MessageView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request, format=None):
		user = request.user
		chat_id = request.data.get('chat_id')
		message = request.data.get('message')
		serializer = MessageSerializer(user, chat_id, message)
		if serializer.is_valid():
			try :
				chat = Chat.objects.filter(id=chat_id)
				if Chat.user1 == user or Chat.user2 == user:
					chat.discussion.add(serializer)
					serializer.save()
				else:
					return Response({"error", "user are not in this chat"}, status=status.HTTP_403_FORBIDDEN)
			except Chat.DoesNotExist:
				return Response({"error", "chat not exist"}, status=status.HTTP_404_NOT_FOUND)
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)

class ChatCreationView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, format=None):
		user1 = request.data.get('user1')
		user2 = request.data.get('user2')
		if user1 is None or user2 is None:
			return Response({ "error :", "specify users" } , status=status.HTTP_400_BAD_REQUEST)
		elif user1 == user2:
			return Response({ "error :", "user1 and user2 can't be the same" } , status=status.HTTP_400_BAD_REQUEST)
		try:
			chat = Chat.objects.get(user1=user1, user2=user2)
		except Chat.DoesNotExist:
			try :
				chat = Chat.objects.get(user1=user2, user2=user1)
			except Chat.DoesNotExist:
				try :
					friendship = Friend_management.objects.filter(friend1=user1, friend2=user2)
				except Friend_management.DoesNotExist:
					return Response({"error:", "friendship not exist"}, status=status.HTTP_400_BAD_REQUEST)
				if friendship.is_accepted == False:
					return Response({"error:", "friendship not accepted"}, status=status.HTTP_400_BAD_REQUEST)
				serializer = ChatSerializer(chat, data=request.data, context={'request': request})
				if serializer.is_valid():
					serializer.save()
					return Response(serializer.data, status=status.HTTP_201_CREATED)
				else :
					return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
		return Response({"error:", "chat already exist"}, status=status.HTTP_400_BAD_REQUEST)