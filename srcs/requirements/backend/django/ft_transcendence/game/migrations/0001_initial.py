# Generated by Django 3.2.4 on 2024-02-02 15:19

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('final_score', models.CharField(default='0:0', max_length=25)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('player_one', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='player_one', to=settings.AUTH_USER_MODEL)),
                ('player_two', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='player_two', to=settings.AUTH_USER_MODEL)),
                ('winner', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='winner', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
