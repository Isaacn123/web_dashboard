from django.db import models

class HeaderSettings(models.Model):
    site_title = models.CharField(max_length=200, default="Your Site Title", help_text="Main site title displayed in header")
    site_subtitle = models.CharField(max_length=300, blank=True, null=True, help_text="Subtitle or tagline displayed in header")
    header_logo_url = models.URLField(max_length=500, blank=True, null=True, help_text="URL for header logo image")
    header_background_color = models.CharField(max_length=7, default="#ffffff", help_text="Header background color (hex code)")
    header_text_color = models.CharField(max_length=7, default="#000000", help_text="Header text color (hex code)")
    show_header = models.BooleanField(default=True, help_text="Whether to show the header on the site")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Header Setting"
        verbose_name_plural = "Header Settings"

    def __str__(self):
        return f"Header Settings - {self.site_title}"

    @classmethod
    def get_active_settings(cls):
        settings = cls.objects.first()  # type: ignore
        if not settings:
            settings = cls.objects.create()  # type: ignore
        return settings 