from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Friend_management
from .serializers import Friend_managementSerializer
from account.models import UserProfile
from rest_framework.permissions import IsAuthenticated

class Friend_managementView(APIView):
	#permission_classes = [IsAuthenticated]

	def get(self, request):
		friend_management = Friend_management.objects.all()
		serializer = Friend_managementSerializer(friend_management, many=True)
		return Response(serializer.data)

	def post(self, request):
		user = request.user
		if user == request.data['friend']:
			return Response({"error:", "friend is user"}, status=status.HTTP_400_BAD_REQUEST)
		try :
			user1 = UserProfile.objects.get(id=request.data['user'])
			user2 = UserProfile.objects.get(id=request.data['friend'])
		except UserProfile.DoesNotExist:
			return Response({"error:", "friend not exist"}, status=status.HTTP_400_BAD_REQUEST)
		try :
			friendship = Friend_management.objects.filter(friend1=user1, friend2=user2)
		except Friend_management.DoesNotExist:
			serializer = Friend_management.objects.create(friend1=user, friend2=request.data['friend'], requester=user)
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response({"error:", "friendship already exist"}, status=status.HTTP_400_BAD_REQUEST)

	def patch(self, request):
		user = request.user
		friend = request.data['friend']
		try :
			friendship = Friend_management.objects.filter(friend1=user, friend2=friend)
		except Friend_management.DoesNotExist:
			return Response({"error:", "friendship not exist"}, status=status.HTTP_400_BAD_REQUEST)
		if request.data['is_accepted'] == True:
			friendship.is_accepted = True
			friendship.save()
			return Response({"message:", "friendship accepted"}, status=status.HTTP_200_OK)
		return Response({"message:", "friendship refused"}, status=status.HTTP_200_OK)