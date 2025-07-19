from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamMemberViewSet, test_team_members


router = DefaultRouter()
router.register(r'team-members', TeamMemberViewSet)
urlpatterns = [
    path('', include(router.urls)),
    path('test-team-members/', test_team_members, name='test_team_members'),
]

