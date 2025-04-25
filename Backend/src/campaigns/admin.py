from django.contrib import admin
from .models import Campaign

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ("title", "goal_amount_formatted", "current_amount_formatted", "creator", "start_date", "created_at")
    search_fields = ("title", "description", "creator__username")
    list_filter = ("start_date", "created_at")

    def goal_amount_formatted(self, obj):
        return f"${obj.goal_amount:.2f}"
    goal_amount_formatted.short_description = "Goal Amount"

    def current_amount_formatted(self, obj):
        return f"${obj.current_amount:.2f}"
    current_amount_formatted.short_description = "Amount Raised"
