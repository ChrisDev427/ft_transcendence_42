from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

class UserProfile(models.Model):
	user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
	is_connected = models.BooleanField(default=False)
	avatar = models.ImageField(upload_to='avatar/', default='/api/account/profile/avatar/defaultPic.png')
	bio = models.TextField(max_length=420, blank=True)
	is_ingame = models.BooleanField(default=False)
	games_id = models.ManyToManyField('game.Game', blank=True)
	win = models.IntegerField(default=0)
	lose = models.IntegerField(default=0)
	friends = models.ManyToManyField('self', blank=True)

	# def __str__(self):
	# 	return self.user.username