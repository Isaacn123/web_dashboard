from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, PublicArticleViewSet, ArticleDetailView

router = DefaultRouter()
router.register(r'articles', ArticleViewSet)
router.register(r'public-articles', PublicArticleViewSet, basename='public-articles')

urlpatterns = [
    path('api/', include(router.urls)),
    path('<slug:slug>/', ArticleDetailView.as_view(), name='article-detail'),
] 