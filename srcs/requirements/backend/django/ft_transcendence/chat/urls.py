from django.urls import path
from . import views
app_name = 'chat'

urlpatterns = [
	path('chat/', views.ChatView.as_view(), name='chat'),
	path('chat/message/', views.MessageView.as_view(), name='message'),
	path('chat/create/', views.ChatCreationView.as_view(), name='create'),
]