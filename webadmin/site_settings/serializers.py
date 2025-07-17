from rest_framework import serializers
from .models import HeaderSettings

class HeaderSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeaderSettings
        fields = '__all__' 