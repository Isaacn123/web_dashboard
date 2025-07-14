from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .models import Article
from .serializers import ArticleSerializer, UserSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()  # type: ignore
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]  # Temporarily allow all access for testing
    
    def perform_create(self, serializer):
        # For now, create without author to test the endpoint
        serializer.save()
