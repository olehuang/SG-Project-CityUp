from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel
from typing import Optional, List, Dict
from bson import ObjectId
from datetime import datetime, timezone, timedelta
import traceback
import math

from db_entities import MongoDB, ReviewStatus
import db_userEntities
import db_photoEntities
router = APIRouter()

# Response model for a user check-in
class CheckInResponse(BaseModel):
    user_id: str
    check_in_date: str
    consecutive_days: int
    points_earned: int
    total_points: int
    message: str
# Response model for leaderboard/ranking info
class UserRankingResponse(BaseModel):
    user_id: str
    username: str
    points: int
    rank: int
    consecutive_days: int
    last_check_in: Optional[str] = None

# Record of a single check-in ,used for history
class CheckInRecord(BaseModel):
    user_id: str
    check_in_date: datetime
    consecutive_days: int
    points_earned: int

photo_collection = MongoDB.get_instance().get_collection("photos")
users_collection = MongoDB.get_instance().get_collection("users")
checkin_collection = MongoDB.get_instance().get_collection("checkins")


# Calculate consecutive check-in days based on uploaded photos
async def calculate_consecutive_days_from_uploads(user_id: str, check_date: datetime) -> int:
    try:
        consecutive_days = 1
        current_date = check_date.date()
        # Go backwards day by day (up to 365 days)
        for days_back in range(1, 365):
            target_date = current_date - timedelta(days=days_back)
            start_of_day = datetime.combine(target_date, datetime.min.time()).replace(tzinfo=timezone.utc)
            end_of_day = start_of_day + timedelta(days=1)
            # Count how many photos were uploaded in this day
            photo_count = await photo_collection.count_documents({
                "user_id": user_id,
                "upload_time": {
                    "$gte": start_of_day,
                    "$lt": end_of_day
                }
            })

            if photo_count > 0:
                consecutive_days += 1
            else: # Break streak if no uploads found
                break
        return consecutive_days
    except Exception as e:
        print(f"Error calculating consecutive days from uploads: {e}")
        return 1

# Calculate how many points a user earns based on consecutive days
async def calculate_checkin_points(consecutive_days: int) -> int:
    if consecutive_days >= 7:
        return 7  # Max daily reward capped at 7 points
    else:
        return consecutive_days

# check if a user has activity in a given collection on a specific day
async def has_activity_today(user_id: str, date: datetime, collection_name: str, date_field: str) -> bool:
    try:
        start_of_day = date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + timedelta(days=1)
        collection = MongoDB.get_instance().get_collection(collection_name)
        count = await collection.count_documents({
            "user_id": user_id,
            date_field: {
                "$gte": start_of_day,
                "$lt": end_of_day
            }
        })
        return count > 0
    except Exception as e:
        print(f"Error checking {collection_name} activity: {e}")
        return False

async def has_uploaded_today(user_id: str, date: datetime) -> bool:
    return await has_activity_today(user_id, date, "photos", "upload_time")

async def has_checked_in_today(user_id: str, date: datetime) -> bool:
    return await has_activity_today(user_id, date, "checkins", "check_in_date")

# Trigger auto-check-in when a user uploads a photo
async def auto_checkin_on_upload(user_id: str, upload_time: datetime) -> Optional[Dict]:
    try:
        # Skip if already checked in today
        if await has_checked_in_today(user_id, upload_time):
            return None
        # Ensure user exists
        user = await db_userEntities.get_user(user_id)
        if not user:
            print(f"User {user_id} not found for auto checkin")
            return None
        # Calculate streak and points
        consecutive_days = await calculate_consecutive_days_from_uploads(user_id, upload_time)

        points_earned = await calculate_checkin_points(consecutive_days)
        # Save check-in record
        checkin_record = {
            "user_id": user_id,
            "check_in_date": upload_time,
            "consecutive_days": consecutive_days,
            "points_earned": points_earned,
            "auto_checkin": True
        }
        await checkin_collection.insert_one(checkin_record)
        # Update user points
        await db_userEntities.update_user_point(user_id, points_earned)

        print(f"Auto checkin for user {user_id}: {consecutive_days} consecutive days, {points_earned} points earned")

        return {
            "user_id": user_id,
            "consecutive_days": consecutive_days,
            "points_earned": points_earned,
            "message": f"Auto checkin successful! {consecutive_days} consecutive days, earned {points_earned} points."
        }

    except Exception as e:
        print(f"Error during auto checkin for user {user_id}: {e}")
        return None

# Get latest check-in info for a user (streak and date)
async def get_latest_checkin_info(user_id: str):
    last_checkin = await checkin_collection.find_one(
        {"user_id": user_id},
        sort=[("check_in_date", -1)]
    )
    consecutive_days = 0
    last_checkin_date = None
    if last_checkin:
        consecutive_days = last_checkin.get("consecutive_days", 0)
        last_checkin_date = last_checkin["check_in_date"].strftime("%Y-%m-%d")
    return consecutive_days, last_checkin_date

#  Check current user's check-in status
@router.get("/checkin/status")
async def get_checkin_status(user_id: str):
    try:
        current_time = datetime.now(timezone.utc)
        # Check if user uploaded photos / checked in today
        checked_in_today = await has_checked_in_today(user_id, current_time)
        uploaded_today = await has_uploaded_today(user_id, current_time)
        # Get current streak
        consecutive_days, last_checkin_date = await get_latest_checkin_info(user_id)
        potential_consecutive_days = consecutive_days
        # If uploaded but not yet checked in, estimate potential streak
        if uploaded_today and not checked_in_today:
            potential_consecutive_days = await calculate_consecutive_days_from_uploads(user_id, current_time)
        return {
            "user_id": user_id,
            "checked_in_today": checked_in_today,
            "uploaded_today": uploaded_today,
            "auto_checkin_enabled": True,
            "consecutive_days": consecutive_days,
            "potential_consecutive_days": potential_consecutive_days,
            "last_checkin": last_checkin_date,
            "next_points": await calculate_checkin_points(
                potential_consecutive_days) if uploaded_today and not checked_in_today else 0,
            "message": "Upload a photo to auto checkin!" if not uploaded_today else "Auto checkin completed!" if checked_in_today else "Auto checkin will be triggered soon!"
        }
    except Exception as e:
        print(f"Error getting checkin status: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Server error getting checkin status")

# Get leaderboard data (with pagination and optional check-in info)
async def get_leaderboard_data(page: int, limit: int, include_checkin_info: bool = True):
    skip = (page - 1) * limit # Calculate how many documents to skip for pagination
    users = MongoDB.get_instance().get_collection('users')
    # Count users with points > 0
    total = await users.count_documents({"point": {"$gt": 0}})
    total_pages = math.ceil(total / limit)
    # Query all users with points, sorted by points descending
    all_users_cursor = users.find(
        {"point": {"$gt": 0}},
        {"user_id": 1, "username": 1, "point": 1}
    ).sort("point", -1)
    all_users = await all_users_cursor.to_list(length=None)
    result_users = []
    last_point = None
    last_rank = 0
    actual_rank = 0
    # Assign ranks ,ties handled: same points → same rank
    for idx, user in enumerate(all_users):
        point = user.get("point", 0)
        if point != last_point:
            actual_rank = idx + 1
            last_point = point
            last_rank = actual_rank

        user_data = {
            "user_id": user.get("user_id"),
            "username": user.get("username", "Unknown"),
            "point": point,
            "rank": last_rank
        }
        # If include_checkin_info = True, initialize with empty values
        if include_checkin_info:
            user_data.update({
                "consecutive_days": 0,
                "last_check_in": None
            })

        result_users.append(user_data)
    # Apply pagination
    start = skip
    end = skip + limit
    paged_users = result_users[start:end]
    # If check-in info is required, fetch latest check-in for these users
    if include_checkin_info:
        user_ids = [user["user_id"] for user in paged_users]
        # group check-ins by user, get the latest one
        checkin_pipeline = [
            {"$match": {"user_id": {"$in": user_ids}}},
            {"$sort": {"check_in_date": -1}},
            {"$group": {
                "_id": "$user_id",
                "last_checkin": {"$first": "$$ROOT"}
            }}
        ]

        checkin_data = {}
        async for doc in checkin_collection.aggregate(checkin_pipeline):
            user_id = doc["_id"]
            last_checkin = doc["last_checkin"]
            checkin_data[user_id] = {
                "consecutive_days": last_checkin.get("consecutive_days", 0),
                "last_check_in": last_checkin["check_in_date"].strftime("%Y-%m-%d")
            }
        # Update paged users with check-in data
        for user in paged_users:
            user_id = user["user_id"]
            if user_id in checkin_data:
                user.update(checkin_data[user_id])

    return {
        "users": paged_users,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    }
# Get ranking info for a single user
async def get_user_ranking(user_id: str):
    try:
        # Get user info
        user = await db_userEntities.get_user(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        # Get user's rank
        ranking_info = await db_userEntities.get_userRanking(user_id)
        # Get latest check-in info
        consecutive_days, last_checkin_date = await get_latest_checkin_info(user_id)
        # Check if the user has already checked in / uploaded today
        current_time = datetime.now(timezone.utc)
        checked_in_today = await has_checked_in_today(user_id, current_time)
        uploaded_today = await has_uploaded_today(user_id, current_time)
        # Count approved photos
        approved_photos = await photo_collection.count_documents({
            "user_id": user_id,
            "status": ReviewStatus.Approved.value
        })
        # Build response
        return {
            "user_id": user_id,
            "username": user.get("username", "Unknown"),
            "points": user.get("point", 0),
            "rank": ranking_info.get("rank", -1),
            "consecutive_days": consecutive_days,
            "last_check_in": last_checkin_date,
            "checked_in_today": checked_in_today,
            "uploaded_today": uploaded_today,
            "can_auto_checkin": uploaded_today and not checked_in_today,
            "approved_photos": approved_photos,
            "auto_checkin_enabled": True
        }

    except HTTPException:
        raise
    except Exception:
        print(f"Error getting user ranking: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Server error getting user ranking")

# Get user check-in history (paginated)
@router.get("/checkin/history")
async def get_checkin_history(
        user_id: str,
        page: int = Query(1, ge=1, description="page number"),
        limit: int = Query(30, ge=1, le=100, description="Quantity per page")
):
    try:
        skip = (page - 1) * limit
        # Query check-in records for user, sorted by latest
        checkins_cursor = checkin_collection.find(
            {"user_id": user_id}
        ).sort("check_in_date", -1).skip(skip).limit(limit)

        checkins = await checkins_cursor.to_list(limit)
        # Total count for pagination
        total_count = await checkin_collection.count_documents({"user_id": user_id})
        total_pages = math.ceil(total_count / limit)
        # Build history response
        history = []
        for checkin in checkins:
            history.append({
                "check_in_date": checkin["check_in_date"].strftime("%Y-%m-%d"),
                "consecutive_days": checkin.get("consecutive_days", 0),
                "points_earned": checkin.get("points_earned", 0),
                "auto_checkin": checkin.get("auto_checkin", False)
            })

        return {
            "user_id": user_id,
            "history": history,
            "total_count": total_count,
            "page": page,
            "limit": limit,
            "total_pages": total_pages
        }

    except Exception as e:
        print(f"Error getting checkin history: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Server error getting checkin history")

# Reward user when a photo is approved
async def reward_photo_approval(user_id: str, photo_id: str):
    try:
        points_reward = 5  # Base reward for approval
        result = await db_userEntities.update_user_point(user_id, points_reward)
        print(f"User {user_id} earned {points_reward} points for approved photo {photo_id}")
        # Check for consecutive approval streak bonus
        bonus_result = await check_consecutive_approvals(user_id, photo_id)
        response = {
            "user_id": user_id,
            "photo_id": photo_id,
            "points_earned": points_reward,
            "message": f"Earned {points_reward} points for approved photo"
        }
        # If bonus reward exists, include it
        if bonus_result:
            response["bonus_reward"] = bonus_result
            response["total_points_earned"] = points_reward + bonus_result["bonus_points"]
            response["message"] += f" + {bonus_result['bonus_points']} bonus points for consecutive approvals!"

        return response

    except Exception as e:
        print(f"Error rewarding photo approval: {e}")
        return None

# Check if user qualifies for bonus points after consecutive approved photos
async def check_consecutive_approvals(user_id: str, latest_photo_id: str) -> Optional[Dict]:
    try:
        # Get user's last rewarded streak photo id
        user = await users_collection.find_one(
            {"user_id": user_id},
            {"last_consecutive_bonus_completing_photo_id": 1}
        )
        if not user:
            print(f"User {user_id} not found for check_consecutive_approvals.")
            return None
        # Convert stored ObjectId if exists
        last_bonus_completing_obj_id = None
        if user.get("last_consecutive_bonus_completing_photo_id"):
            try:
                last_bonus_completing_obj_id = ObjectId(user["last_consecutive_bonus_completing_photo_id"])
            except Exception as e:
                print(
                    f"Warning: Invalid ObjectId in last_consecutive_bonus_completing_photo_id for user {user_id}: {e}. Treating as None.")
        # Fetch all approved photos sorted by upload time
        approved_photos_cursor = photo_collection.find(
            {"user_id": user_id, "status": ReviewStatus.Approved.value},
            {"_id": 1, "upload_time": 1}
        ).sort("upload_time", 1)

        approved_photos = []
        batch_size = 1000
        async for photo in approved_photos_cursor:
            approved_photos.append(photo)

            if len(approved_photos) >= batch_size:
                break

        if len(approved_photos) < 5:
            return None
        # Locate latest approved photo in list
        latest_photo_obj_id = ObjectId(latest_photo_id)
        latest_approved_photo_index = -1
        for i, photo in enumerate(approved_photos):
            if photo["_id"] == latest_photo_obj_id:
                latest_approved_photo_index = i
                break

        if latest_approved_photo_index == -1:
            print(f"Latest photo {latest_photo_id} not found in approved photos list for user {user_id}.")
            return None

        total_bonus_points = 0
        consecutive_streaks = 0
        # Start checking from last rewarded photo
        start_check_index = 0
        if last_bonus_completing_obj_id:

            for i, photo in enumerate(approved_photos):
                if photo["_id"] == last_bonus_completing_obj_id:
                    start_check_index = i + 1
                    break
        # Every 5 consecutive approvals → +5 points
        current_index = start_check_index
        while current_index + 4 <= latest_approved_photo_index:

            if current_index + 4 < len(approved_photos):
                consecutive_streaks += 1
                total_bonus_points += 5
                current_index += 5
            else:
                break

        if total_bonus_points == 0:
            return None
        # Update user points and mark last rewarded photo
        await db_userEntities.update_user_point(user_id, total_bonus_points)

        await users_collection.update_one(
            {"user_id": user_id},
            {"$set": {"last_consecutive_bonus_completing_photo_id": latest_photo_id}}
        )

        print(
            f"User {user_id} earned {total_bonus_points} bonus points for {consecutive_streaks} consecutive approval streaks (ending with {latest_photo_id}).")

        return {
            "user_id": user_id,
            "bonus_points": total_bonus_points,
            "consecutive_approved_streaks": consecutive_streaks,
            "message": f"Congratulations! You earned {total_bonus_points} bonus points for {consecutive_streaks} consecutive approval streak(s)!"
        }

    except Exception as e:
        print(f"Error checking consecutive approvals for user {user_id}: {traceback.format_exc()}")
        return None

# Recalculate consecutive approval streaks for a user
async def recalculate_consecutive_approvals_for_user(user_id: str) -> Optional[Dict]:
    try:
        # Reset user's last rewarded streak photo
        await users_collection.update_one(
            {"user_id": user_id},
            {"$unset": {"last_consecutive_bonus_completing_photo_id": ""}}
        )
        # Fetch all approved photos
        approved_photos_cursor = photo_collection.find(
            {"user_id": user_id, "status": ReviewStatus.Approved.value},
            {"_id": 1, "upload_time": 1}
        ).sort("upload_time", 1)

        approved_photos = await approved_photos_cursor.to_list(length=None)

        if len(approved_photos) < 5:
            return {
                "user_id": user_id,
                "bonus_points": 0,
                "consecutive_approved_streaks": 0,
                "message": "Not enough approved photos for consecutive bonus."
            }
        # Calculate bonus points (every 5 photos → +5 points)
        total_bonus_points = 0
        consecutive_streaks = len(approved_photos) // 5
        total_bonus_points = consecutive_streaks * 5

        if total_bonus_points > 0:
            # Update user points
            await db_userEntities.update_user_point(user_id, total_bonus_points)
            # Save the last rewarded photo id
            last_rewarded_photo_index = consecutive_streaks * 5 - 1
            if last_rewarded_photo_index < len(approved_photos):
                last_rewarded_photo_id = str(approved_photos[last_rewarded_photo_index]["_id"])
                await users_collection.update_one(
                    {"user_id": user_id},
                    {"$set": {"last_consecutive_bonus_completing_photo_id": last_rewarded_photo_id}}
                )

        print(
            f"Recalculated: User {user_id} earned {total_bonus_points} bonus points for {consecutive_streaks} consecutive approval streaks.")

        return {
            "user_id": user_id,
            "bonus_points": total_bonus_points,
            "consecutive_approved_streaks": consecutive_streaks,
            "message": f"Recalculated: You earned {total_bonus_points} bonus points for {consecutive_streaks} consecutive approval streak(s)!"
        }

    except Exception as e:
        print(f"Error recalculating consecutive approvals for user {user_id}: {traceback.format_exc()}")
        return None