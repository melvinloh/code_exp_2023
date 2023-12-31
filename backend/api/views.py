from django.shortcuts import render

from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import FoodListing
from rest_framework.response import Response
from rest_framework import status
from .models import Category
from decimal import Decimal
from user.models import User

from datetime import datetime
from rest_framework.decorators import api_view
from .serializer import FoodListingSerializer

from random import seed, shuffle
from django.db.models import Q
import requests


# Create your views here.

@api_view(['POST'])
@csrf_exempt
def search_listings_image(request):
    if request.method == 'POST':
        try:
            api_key = 'acc_dcea7383602ad60'
            api_secret = '857596328f98745a252753beca1f6900'
            image_url = request.POST.get('url')

            response = requests.get(
                'https://api.imagga.com/v2/tags?image_url=%s' % image_url,
                auth=(api_key, api_secret))
            
            # Parse the JSON response
            response_data = response.json()

            # Select the first tag from the 'tags' array
            first_tag = response_data['result']['tags'][0]

            # Extract the confidence and tag information
            confidence = first_tag['confidence']
            tag = first_tag['tag']['en']

            # Create a dictionary with the selected information
            result = {
                'confidence': confidence,
                'tag': tag
            }

            return JsonResponse(result)

        except:
            return Response({'error': 'Invalid request method.'}, status=400)

        

@api_view(['POST'])
@csrf_exempt
def search_listings(request):
    if request.method == 'POST':
        # Retrieve form data from the request
        user_id = request.POST.get('userId')
        searchfield = request.POST.get('searchfield')

        try:
            user = User.objects.get(id=user_id)
            relevant_food_listings = FoodListing.objects.filter(
                Q(title__icontains=searchfield) |
                Q(pickup_location__icontains=searchfield) |
                Q(category__category_name__icontains=searchfield)
            ).exclude(user=user)
            
            serialized_listings = FoodListingSerializer(relevant_food_listings, many=True)
            return Response(serialized_listings.data)
        
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)
    
    return Response({'error': 'Invalid request method.'}, status=400)


@api_view(['POST'])
@csrf_exempt
def category_listings(request):
    if request.method == 'POST':
        # Retrieve form data from the request
        user_id = request.POST.get('userId')
        category_name = request.POST.get('category')
        filter = request.POST.get('filter')

        try:
            user = User.objects.get(id=user_id)
            relevant_food_listings = FoodListing.objects.filter(category__category_name=category_name).exclude(user=user)
            
            # do sorting with relevant_food_listings queryset
            relevant_food_listings = sorting_queryset(relevant_food_listings, filter)

            serialized_listings = FoodListingSerializer(relevant_food_listings, many=True)
            return Response(serialized_listings.data)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)
    return Response({'error': 'Invalid request method.'}, status=400)

# utility function to sort based on filter
def sorting_queryset(queryset, filter):
    # "Best Match", "Expiring", "Price - Low to High", "Price - High to Low", "Region: Downtown", "Region: East", "Region: West", "Region: North",

    if filter == 'Best Match':
        return queryset.order_by('-id')
    elif filter == 'Expiring':
        return queryset.order_by('expiration_date')
    elif filter == 'Free':
        return queryset.filter(price=0)
    elif filter == 'Price - Low to High':
        return queryset.order_by('price')
    elif filter == 'Price - High to Low':
        return queryset.order_by('-price')
    elif filter == 'Region: East':
        return queryset.order_by('-longitude')
    elif filter == 'Region: West':
        return queryset.order_by('longitude')
    elif filter == 'Region: North':
        return queryset.order_by('-latitude')
    elif filter == 'Region: Downtown':
        return queryset.order_by('latitude')
    else:
        return queryset

    


@api_view(['POST'])
@csrf_exempt
def listings_for_you(request):
    if request.method == 'POST':
        # Retrieve form data from the request
        user_id = request.POST.get('userId')
        try:
            user = User.objects.get(id=user_id)
            relevant_food_listings = FoodListing.objects.exclude(user=user)
            
            # Randomize the order of the food listings
            seed(12345)  # Initialize the random seed
            relevant_food_listings = list(relevant_food_listings)
            shuffle(relevant_food_listings)
            
            serialized_listings = FoodListingSerializer(relevant_food_listings, many=True)
            return Response(serialized_listings.data)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)
    return Response({'error': 'Invalid request method.'}, status=400)

@api_view(['POST'])
@csrf_exempt
def listings_near_you(request):
    if request.method == 'POST':
        # Retrieve form data from the request
        user_id = request.POST.get('userId')
        try:
            user = User.objects.get(id=user_id)
            relevant_food_listings = FoodListing.objects.exclude(user=user)  # Filter food listings that do not belong to the user
            serialized_listings = FoodListingSerializer(relevant_food_listings, many=True)
            return Response(serialized_listings.data)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)
    return Response({'error': 'Invalid request method.'}, status=400)


# Get single food item data
@api_view(['GET'])
@csrf_exempt
def get_food_listing(request, pk):
    try:
        food_object = FoodListing.objects.get(id=pk)
        
        serializer_obj = FoodListingSerializer(food_object, many=False)
        return Response(serializer_obj.data)
    except:
        return JsonResponse({'error': 'Food List Item not found.'}, status=404)


@api_view(['POST'])
@csrf_exempt
def delete_listing(request):
    if request.method == 'POST':
        # Retrieve form data from the request
        listing_id = request.POST.get('listingId')
        try:
            # Find the listing with the given ID
            listing = FoodListing.objects.get(id=listing_id)
            listing.delete()
            return Response({'message': 'Listing deleted successfully'})
        except FoodListing.DoesNotExist:
            return Response({'error': 'Listing not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@csrf_exempt
def get_my_listings(request):
    if request.method == 'POST':
        # Retrieve form data from the request
        user_id = request.POST.get('userId')
        try:
            user = User.objects.get(id=user_id)
            all_my_food_listings = FoodListing.objects.filter(user=user)
            serialized_listings = FoodListingSerializer(all_my_food_listings, many=True)
            return Response(serialized_listings.data)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)
    return Response({'error': 'Invalid request method.'}, status=400)


@api_view(['POST'])
@csrf_exempt
def edit_food_listing(request):
    if request.method == 'POST':
        # Retrieve form data from the request
        food_listing = FoodListing.objects.get(id=request.POST.get('foodId'))

        food_listing.title = request.POST.get('title')
        food_listing.description = request.POST.get('description')
        food_listing.price = Decimal(request.POST.get('price'))
        food_listing.pickup_location = request.POST.get('pickupLocation')
        food_listing.category = Category.objects.get(category_name=request.POST.get('selectedCategory'))

        expiration_date_string = request.POST.get('expirationDate')
        food_listing.expiration_date = datetime.strptime(expiration_date_string, "%a %b %d %Y").date()

        food_listing.longitude = float(request.POST.get('longitude'))
        food_listing.latitude = float(request.POST.get('latitude'))

        if request.POST.get('s3ImageUrl') is not None:
            food_listing.image = request.POST.get('s3ImageUrl')

        food_listing.save()
            
        # Return success response
        return Response({'success': 'Food listing edited successfully.'}, status=status.HTTP_200_OK)

    else:
        # Return error response for invalid request method
        return Response({'error': 'Invalid request method.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@csrf_exempt
def create_food_listing(request):

    if request.method == 'POST':

        # Retrieve form data from the request
        user = User.objects.get(id=request.POST.get('userId'))
        title = request.POST.get('title')
        description = request.POST.get('description')
        price = request.POST.get('price')
        pickup_location = request.POST.get('pickupLocation')
        category = request.POST.get('selectedCategory')

        expiration_date_string = request.POST.get('expirationDate')
        expiration_date = datetime.strptime(expiration_date_string, "%a %b %d %Y").date()

        longitude = request.POST.get('longitude')
        latitude = request.POST.get('latitude')

        image_url = request.POST.get('s3ImageUrl')


        # Create a new FoodListing instance
        food_listing = FoodListing(
            user=user,
            title=title,
            description=description,
            price=Decimal(price),
            pickup_location=pickup_location,
            category=Category.objects.get(category_name=category),
            expiration_date=expiration_date,
            image=image_url,
            latitude=float(latitude),
            longitude=float(longitude),
        )

        food_listing.save()

        # Return success response
        return Response({'success': 'Food listing created successfully.'}, status=status.HTTP_201_CREATED)
    else:
        # Return error response for invalid request method
        return Response({'error': 'Invalid request method.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

