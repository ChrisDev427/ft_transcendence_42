# Generated by Django 3.2.4 on 2024-01-30 10:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0039_auto_20240130_1011'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='chats',
        ),
        migrations.RemoveField(
            model_name='userprofile',
            name='friend',
        ),
    ]
