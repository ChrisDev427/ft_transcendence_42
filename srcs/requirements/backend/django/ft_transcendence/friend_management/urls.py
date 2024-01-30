from django.urls import path
from . import views

app_name = 'friend_management'

urlpatterns = [
	path('friend_management/', views.Friend_managementView.as_view(), name='friend_management'),
	path('friend_management/<int:pk>/', views.Friend_managementView.as_view(), name='friend_management-numero'),
]