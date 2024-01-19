# Generated by Django 3.2.4 on 2024-01-19 09:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0031_userprofile_opt_expiration_userprofile_otp_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='friends',
            field=models.ManyToManyField(blank=True, related_name='_account_userprofile_friends_+', to='account.UserProfile'),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='otp',
            field=models.CharField(blank=True, max_length=16, null=True),
        ),
    ]