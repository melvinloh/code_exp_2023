from django.urls import path
from .views import MyTokenObtainPairView, RegisterView, LogoutView

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns  = [
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
]