#!/usr/bin/env python3
"""
Script to create a test admin user for the dashboard
Run this with: python3 create_test_user.py
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

def create_test_user():
    # Check if admin user already exists
    if User.objects.filter(username='admin').exists():
        print("Admin user already exists!")
        return
    
    # Create superuser
    user = User.objects.create_user(
        username='admin',
        email='admin@example.com',
        password='admin123',
        first_name='Admin',
        last_name='User',
        is_staff=True,
        is_superuser=True
    )
    
    print(f"Created admin user:")
    print(f"Username: {user.username}")
    print(f"Password: admin123")
    print(f"Email: {user.email}")
    print("\nYou can now login to the dashboard!")

if __name__ == '__main__':
    create_test_user() 