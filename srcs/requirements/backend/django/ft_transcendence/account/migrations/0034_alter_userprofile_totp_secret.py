# Generated by Django 4.2 on 2024-01-19 12:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0033_userprofile_totp_secret_alter_userprofile_friends'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='totp_secret',
            field=models.CharField(blank=True, max_length=64, null=True),
        ),
    ]
