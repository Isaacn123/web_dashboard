from models import TeamMember
from rest_framework import  viewsets
from .serializers import TeamMemberSerializer


# Create your views here.
class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer