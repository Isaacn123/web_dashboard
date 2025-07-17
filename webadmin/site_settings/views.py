from django.shortcuts import render
from rest_framework import viewsets
from .models import HeaderSettings
from .serializers import HeaderSettingsSerializer
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HeaderSettingsViewSet

router = DefaultRouter()
router.register(r'header-settings', HeaderSettingsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

# Create your views here.

class HeaderSettingsViewSet(viewsets.ModelViewSet):
    queryset = HeaderSettings.objects.all()
    serializer_class = HeaderSettingsSerializer
