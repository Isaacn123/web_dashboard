from django.contrib import admin
from .models import TeamMember
# Register your models here.
@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'photo', 'email', 'phone', 'twitter', 'linkedin', 'order', 'active')
    search_fields = ('name', 'role')
    list_filter = ('role', 'active')

    