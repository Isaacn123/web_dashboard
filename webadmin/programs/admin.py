from django.contrib import admin
from .models import Programs
# Register your models here.
@admin.register(Programs)
class ProgramsAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'category')
    list_filter = ('category',)
    search_fields = ('name', 'description')