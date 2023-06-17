from django.db import models
from user.models import User
# from storages.backends.s3boto3 import S3Boto3Storage

# Create your models here.


class Category(models.Model):
    category_name = models.CharField(max_length=100)

    def __str__(self):
        return self.category_name

class FoodListing(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) # the person who list the FoodListing
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='food_images/', null=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=5, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    expiration_date = models.DateField()

    pickup_location = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True) # for backend internal use only
    longitude = models.FloatField(null=True, blank=True)  # for backend internal use only

