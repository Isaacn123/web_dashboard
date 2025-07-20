from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OnGoingProgramsViewSet


router = DefaultRouter()
router.register(r'ongoing_programs', OnGoingProgramsViewSet, basename='ongoing_programs')
urlpatterns = [
    path('', include(router.urls)),
]