# type: ignore
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.urls import reverse
from ckeditor.fields import RichTextField

class Article(models.Model):
    title = models.CharField(max_length=200)
    content = RichTextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    author_name = models.CharField(max_length=100, blank=True, null=True)
    date = models.CharField(max_length=100, blank=True, null=True)  # User-selected date (e.g., 'May 20, 2025')
    image_url = models.URLField(max_length=500, blank=True, null=True, help_text="ImgBB image URL")
    url = models.URLField(max_length=500, blank=True, null=True, help_text="URL for the article detail page")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=False)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
        # Set the URL after saving (assuming detail URL is /articles/<slug>/)
        expected_url = f"/articles/{self.slug}/"
        if self.url != expected_url:
            self.url = expected_url
            super().save(update_fields=["url"])
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        # If you use slug in your URL pattern:
        return reverse('article-detail', kwargs={'slug': self.slug})
        # If you use id, use: return reverse('article-detail', kwargs={'pk': self.pk})
    
    class Meta:
        ordering = ['-created_at']
