from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from .serializers import OnGoingProgramsSerializer
from .models import Programs
# Create your views here.

class OnGoingProgramsViewSet(viewsets.ModelViewSet):
    queryset = Programs.objects.all()
    serializer_class = OnGoingProgramsSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'category']
    ordering_fields = ['order', 'created_at', 'title']
    ordering = ['order']

