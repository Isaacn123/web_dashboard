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
        article = serializer.save()
        # The model's save() will set the URL
        return article

class PublicArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.filter(published=True)
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]
