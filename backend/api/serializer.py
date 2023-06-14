from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import *


class FoodListingSerializer(ModelSerializer):
    category = serializers.CharField(source='category.category_name')
    food_image_url = serializers.SerializerMethodField() # name must match function: get_<firm_image_url>
    user = serializers.CharField(source='user.username')
    lister_contact_number = serializers.CharField(source='user.phone_number')

    class Meta:
        model = FoodListing
        fields = '__all__'
    
    def get_food_image_url(self, obj):

        if obj.image:
            return obj.image.url
        else:
            return '/media/hardcoded-image.jpg'
        
