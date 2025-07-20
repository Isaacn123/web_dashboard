from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OnGoingProgramsViewSet


router = DefaultRouter()
router.register(r'programs', OnGoingProgramsViewSet, basename='programs')
urlpatterns = [
    path('', include(router.urls)),
]