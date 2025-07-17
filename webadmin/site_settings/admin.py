from django.contrib import admin
from .models import HeaderSettings
# Register your models here.

@admin.register(HeaderSettings)
class HeaderSettingsAdmin(admin.ModelAdmin):
    list_display = ('site_title','site_subtitle','header_logo_url','show_header','created_at','updated_at')
    search_fields = ('site_title','site_subtitle')
    list_filter = ('show_header','created_at','updated_at')
    
 
   