from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HeaderSettingsViewSet

router = DefaultRouter()
router.register(r'header-settings', HeaderSettingsViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
] 