# Generated by Django 4.2 on 2024-01-16 16:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0021_userprofile_is_ingame'),
        ('game', '0004_game_player_one_game_player_two_game_winner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='player_one',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='player_one', to='account.userprofile'),
        ),
        migrations.AlterField(
            model_name='game',
            name='player_two',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='player_two', to='account.userprofile'),
        ),
        migrations.AlterField(
            model_name='game',
            name='winner',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='winner', to='account.userprofile'),
        ),
    ]