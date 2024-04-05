from django.urls import path
from .views import GameView , GameDetailView

app_name = 'game'

urlpatterns = [
	path('', GameView.as_view(), name='game'),
	path('<int:id>/', GameDetailView.as_view(), name='game'),
]