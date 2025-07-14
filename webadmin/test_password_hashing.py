#!/usr/bin/env python3
"""
Test script to verify password hashing is working correctly
"""
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password

def test_password_hashing():
    """Test that passwords are properly hashed when users are created"""
    
    print("Testing password hashing...")
    
    # Test 1: Create a user with a password
    test_username = "test_user_hashing"
    test_password = "test_password_123"
    
    # Delete user if exists
    User.objects.filter(username=test_username).delete()
    
    # Create user
    user = User.objects.create_user(
        username=test_username,
        email="test@example.com",
        password=test_password
    )
    
    # Check if password is hashed
    user.refresh_from_db()
    
    print(f"User created: {user.username}")
    print(f"Password field in DB: {user.password[:20]}...")  # Show first 20 chars
    
    # Verify password is hashed (should not be plain text)
    if user.password == test_password:
        print("❌ ERROR: Password is not hashed!")
        return False
    else:
        print("✅ Password is hashed (not plain text)")
    
    # Verify password can be checked
    if check_password(test_password, user.password):
        print("✅ Password verification works correctly")
    else:
        print("❌ ERROR: Password verification failed!")
        return False
    
    # Test 2: Create user through serializer (API-like)
    from users.serializers import UserSerializer
    
    test_username2 = "test_user_api"
    test_password2 = "test_password_456"
    
    # Delete user if exists
    User.objects.filter(username=test_username2).delete()
    
    # Create user data
    user_data = {
        'username': test_username2,
        'email': 'test2@example.com',
        'password': test_password2,
        'first_name': 'Test',
        'last_name': 'User'
    }
    
    # Use serializer
    serializer = UserSerializer(data=user_data)
    if serializer.is_valid():
        user2 = serializer.save()
        print(f"User created via serializer: {user2.username}")
        print(f"Password field in DB: {user2.password[:20]}...")
        
        # Verify password is hashed
        if user2.password == test_password2:
            print("❌ ERROR: Password from serializer is not hashed!")
            return False
        else:
            print("✅ Password from serializer is hashed")
        
        # Verify password can be checked
        if check_password(test_password2, user2.password):
            print("✅ Password verification works for serializer-created user")
        else:
            print("❌ ERROR: Password verification failed for serializer-created user!")
            return False
    else:
        print(f"❌ ERROR: Serializer validation failed: {serializer.errors}")
        return False
    
    # Clean up
    User.objects.filter(username__in=[test_username, test_username2]).delete()
    
    print("\n🎉 All password hashing tests passed!")
    return True

if __name__ == "__main__":
    test_password_hashing() 