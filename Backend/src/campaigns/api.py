from typing import List
from ninja import Router
from ninja_jwt.authentication import JWTAuth
from django.shortcuts import get_object_or_404
from .models import *
from .schemas import *

router = Router()

# Public route to list all campaign entries
@router.get("", response=List[CampaignOut])
def list_campaigns_entries(request):
    return Campaign.objects.all()

@router.get("/mine", response=List[CampaignOut], auth=JWTAuth())
def my_campaigns(request):
    print("📥 /mine endpoint hit")

    # Confirm user from JWT
    print("🔐 Authenticated user:", request.user)

    # Query campaigns from DB
    campaigns = Campaign.objects.filter(creator=request.user)
    print(f"🔎 Found {campaigns.count()} campaigns")

    # See raw data returned (this will help detect serialization issues)
    for c in campaigns:
        print("📦 Campaign object:", {
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "goal_amount": float(c.goal_amount),
            "current_amount": float(c.current_amount),
            "creator_id": c.creator_id,
            "created_at": c.created_at,
            "updated_at": c.updated_at,
        })

    # Return queryset normally (we can fallback to manual list later)
    return campaigns

@router.post("/create", response=CampaignOut, auth=JWTAuth())
def create_campaign(request, payload: CampaignEntryCreateSchema):
    # Use payload data to create a new campaign
    campaign = Campaign.objects.create(
        title=payload.title,
        description=payload.description,
        goal_amount=payload.goal_amount,
        end_date=payload.end_date,
        creator=request.user  # use JWT-authenticated user
    )
    return campaign

# Optional route for user profile + campaigns
@router.get("/me/campaigns", response=UserWithCampaignsSchema, auth=JWTAuth())
def get_user_with_campaigns(request):
    user = request.user
    return {
        "id": user.id,
        "username": user.username,
        "campaigns": user.campaigns.all()
    }

# ✅ Dynamic route goes LAST to avoid matching '/mine' as an int
@router.get("campaign/{campaign_id}/", response=CampaignOut)
def get_campaign(request, campaign_id: int):
    campaign = get_object_or_404(Campaign, id=campaign_id)
    return campaign
