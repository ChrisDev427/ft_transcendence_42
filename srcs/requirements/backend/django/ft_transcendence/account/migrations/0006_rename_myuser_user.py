# Generated by Django 4.2 on 2024-01-12 14:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('admin', '0003_logentry_add_action_flag_choices'),
        ('game', '0003_remove_game_player_one_remove_game_player_two_and_more'),
        ('account', '0005_alter_myuser_last_login'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='MyUser',
            new_name='User',
        ),
    ]