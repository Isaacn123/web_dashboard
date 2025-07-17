from rest_framework import serializers
from .models import Article
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ArticleSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    url = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'author', 'author_name','date', 'image_url', 'created_at', 'updated_at', 'published', 'slug', 'url']
        read_only_fields = ['created_at', 'updated_at', 'author', 'slug', 'url'] 

    def get_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.get_absolute_url()) if request else obj.get_absolute_url() 