from django.db import models
from django.urls import reverse
from django.utils import timezone


class Todo(models.Model):
    # user = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    task = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.task}"

    class Meta:
        ordering = ["completed", "-created_at"]
