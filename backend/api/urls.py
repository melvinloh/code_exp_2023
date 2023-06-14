from django.urls import path
from . import views


urlpatterns  = [
    path('create-food-listing/', views.create_food_listing, name='create-food-listing'),
    path('get-my-listings/', views.get_my_listings, name='get-my-listings'),
    path('listings-for-you/', views.listings_for_you, name='listings-for-you'),
    path('listings-near-you/', views.listings_near_you, name='listings-near-you'),
    path('category-listings/', views.category_listings, name='category-listings'),
    path('search-listings/', views.search_listings, name='search-listings'),
    path('delete-listing/', views.delete_listing, name='delete-listing'),
    path('food/<str:pk>', views.get_food_listing, name='food'),

]