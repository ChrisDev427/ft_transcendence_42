# Generated by Django 4.2 on 2024-01-18 15:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0030_alter_userprofile_friends'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='opt_expiration',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='otp',
            field=models.CharField(blank=True, max_length=16),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='two_fa',
            field=models.BooleanField(default=False),
        ),
    ]