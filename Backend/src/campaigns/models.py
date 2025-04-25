from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from Core import settings

# Create your models here.


 
class CampaignEntry(models.Model):
    title = models.CharField(max_length=255, unique=True)  # Campaign title
    description = models.TextField()  # Detailed campaign description
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)  # Campaign goal (if fundraising)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Amount raised
    start_date = models.DateTimeField(default=timezone.now)  # Start date
    end_date = models.DateTimeField(null=True, blank=True)  # End date (optional)
    #status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")  # Campaign status
    #creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="campaigns")  # User who created the campaign
    creator = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name="created_entries",
    null=True,  # ✅ Temporarily allow nulls
    blank=True
)
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when created
    updated_at = models.DateTimeField(auto_now=True)  # Timestamp when updated


from django.conf import settings

class Campaign(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    creator = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name="created_campaigns"  # changed from "campaigns"
)
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
