# Generated by Django 3.2.19 on 2023-06-11 16:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='phone_number',
            field=models.PositiveIntegerField(default=91128415),
            preserve_default=False,
        ),
    ]
