from .models import TeamMember
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .serializers import TeamMemberSerializer


# Create your views here.
class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [AllowAny]  # Temporarily allow all access for testing

# Test view to debug the issue
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def test_team_members(request):
    if request.method == 'GET':
        members = TeamMember.objects.all()
        serializer = TeamMemberSerializer(members, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = TeamMemberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)