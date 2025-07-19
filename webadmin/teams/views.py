from .models import TeamMember
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .serializers import TeamMemberSerializer


# Create your views here.
class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [AllowAny]  # Temporarily allow all access for testing