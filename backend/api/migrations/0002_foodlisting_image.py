# Generated by Django 3.2.19 on 2023-06-11 17:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='foodlisting',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='food_images/'),
        ),
    ]
