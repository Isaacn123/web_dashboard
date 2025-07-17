from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Role, UserProfile

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name', 'description']

class UserProfileSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    role_id = serializers.PrimaryKeyRelatedField(queryset=Role.objects.all(), source='role', write_only=True, required=False)  # type: ignore
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True, required=True)  # type: ignore

    class Meta:
        model = UserProfile
        fields = ['id', 'role', 'role_id', 'user_id']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    profile_id = serializers.PrimaryKeyRelatedField(queryset=UserProfile.objects.all(), source='profile', write_only=True, required=False)  # type: ignore
    password = serializers.CharField(write_only=True, required=False)
    is_active = serializers.BooleanField(default=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'profile', 'profile_id', 'password']
        read_only_fields = ['id']

    def create(self, validated_data):
        # Extract password and hash it
        password = validated_data.pop('password', None)
        
        # Create user without password first
        user = User.objects.create(**validated_data)
        
        # Set password (this will hash it)
        if password:
            user.set_password(password)
            user.save()
        
        return user

    def update(self, instance, validated_data):
        # Handle password update
        password = validated_data.pop('password', None)
        profile_data = validated_data.pop('profile', None)
        profile_id = validated_data.pop('profile_id', None)

        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Update password if provided
        if password:
            instance.set_password(password)

        instance.save()

        # Update UserProfile role if provided
        if profile_id:
            profile = instance.profile
            if 'role' in profile_id:
                profile.role = profile_id['role']
                profile.save()

        return instance 