# Generated by Django 4.2 on 2024-01-17 08:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0021_userprofile_is_ingame'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='avatar',
            field=models.ImageField(default='account/avatars/defaultPic.png', upload_to='avatars/'),
        ),
    ]
