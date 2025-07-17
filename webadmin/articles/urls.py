from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, PublicArticleViewSet

router = DefaultRouter()
router.register(r'articles', ArticleViewSet)
router.register(r'public-articles', PublicArticleViewSet, basename='public-articles')

urlpatterns = [
    path('api/', include(router.urls)),
] 