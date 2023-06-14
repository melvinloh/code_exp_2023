from django.shortcuts import render
from .serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

@method_decorator(csrf_exempt, name='post')
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        phoneNumber = request.data.get('phoneNumber')

        if not username or not password or not email or not phoneNumber:
            return Response({'error': 'Username, email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(username=username, password=password, email=email, phone_number=phoneNumber)
            return Response({'success': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
        except:
            return Response({'error': 'User registration failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='post')
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({'success': 'User logged out successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'error': 'Failed to log out user.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer