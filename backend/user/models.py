from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.PositiveIntegerField(null=True, blank=True)

    class Meta(AbstractUser.Meta):
        # Set the model's name to 'user' to avoid clashes with the default User model
        swappable = 'AUTH_USER_MODEL'