"""
URL configuration for mysite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('articles.urls')),
    path('api/', include('users.urls')),
    path('api/', include('site_settings.urls')),
    path('api/', include('teams.urls')),
    path('api/', include('programs.urls')),
    path('api/', include('articles.urls')),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
