# Generated by Django 3.2.4 on 2024-02-03 08:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('chat', '__first__'),
        ('account', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Friend_management',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_accepted', models.BooleanField(default=False)),
                ('chat', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='chat.chat')),
                ('friend1', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='friend1', to='account.userprofile')),
                ('friend2', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='friend2', to='account.userprofile')),
                ('requester', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='requester', to='account.userprofile')),
            ],
        ),
    ]
