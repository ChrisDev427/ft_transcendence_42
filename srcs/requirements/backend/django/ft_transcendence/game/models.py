from django.db import models
from django.contrib.auth.models import User

class Game(models.Model):
	id = models.AutoField(primary_key=True)
	player_one = models.ForeignKey(User, on_delete=models.PROTECT, related_name='player_one', null=True, default=None)
	player_two = models.ForeignKey(User, on_delete=models.PROTECT, related_name='player_two', null=True, default=None)
	final_score = models.CharField(max_length=25, default='0:0')
	winner = models.ForeignKey(User, on_delete=models.PROTECT, related_name='winner', null=True, default=None)
	game_type = models.CharField(max_length=25, default=None)
	difficulty = models.CharField(max_length=25, default=None)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)