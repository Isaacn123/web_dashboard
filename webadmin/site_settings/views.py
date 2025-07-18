from rest_framework import viewsets
from .models import HeaderSettings
from .serializers import HeaderSettingsSerializer

class HeaderSettingsViewSet(viewsets.ModelViewSet):
    queryset = HeaderSettings.objects.all()
    serializer_class = HeaderSettingsSerializer
