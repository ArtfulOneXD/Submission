from datetime import datetime
from decimal import Decimal
from ninja import Schema

# Schema for creating a new campaign entry (user is taken from request.user)
class CampaignEntryCreateSchema(Schema):
    title: str
    description: str
    goal_amount: Decimal
    start_date: datetime
    end_date: datetime | None = None

from accounts.schemas import UserSchema  # import your user schema

class CampaignEntryDetailSchema(Schema):
    id: int
    title: str
    description: str
    goal_amount: Decimal
    current_amount: Decimal
    start_date: datetime
    end_date: datetime | None = None
    created_at: datetime
    updated_at: datetime
    creator: UserSchema  # ✅ link to user

class CampaignEntryListSchema(Schema):
    id: int
    title: str
    description: str
    goal_amount: Decimal
    current_amount: Decimal
    start_date: datetime
    end_date: datetime | None = None
    creator: UserSchema  # ✅ optional but useful
from typing import List

class UserWithCampaignsSchema(Schema):
    id: int
    username: str
    campaigns: List[CampaignEntryListSchema]

from ninja import Schema
from datetime import datetime

class CampaignOut(Schema):
    id: int
    title: str
    description: str
    goal_amount: float
    current_amount: float
    created_at: datetime
    updated_at: datetime
    creator_id: int  # ✅ explicitly include the FK as an integer
