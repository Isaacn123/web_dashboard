from django.db import models

# Create your models here.

class Programs(models.Model): 
    title = models.CharField(max_length=100)
    description = models.TextField()
    category = models.TextField()
    order = models.PositiveIntegerField(default=0)  # type: ignore # For sorting
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['created_at']
