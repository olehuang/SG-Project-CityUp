import os
import io
from fastapi.testclient import TestClient
from main import app
from pymongo import MongoClient
import traceback

client = TestClient(app)

TEST_REVIEWER_ID = "test_reviewer_001"

def test_upload_multiple_photos():
    print("\n--- Running test_upload_multiple_photos ---")
    image_paths = [
        "F:\\Bild\\Weixin Image_20250520074752.png",
        "F:\\Bild\\Weixin Image_20250521231244.jpg",
    ]
    files = []
    for img_path in image_paths:
        if os.path.exists(img_path):
            with open(img_path, "rb") as f:
                content = f.read()
                file_obj = io.BytesIO(content)
                file_name = os.path.basename(img_path)
                mime_type = "image/png" if file_name.lower().endswith(".png") else "image/jpeg"
                files.append(("photos", (file_name, file_obj, mime_type)))
        else:
            print(f"Warning: Test file does not exist: {img_path}. Skipping upload for this file.")

    if not files:
        print("Error: No image files found to upload for test. Please ensure paths are correct or create dummy files.")
        assert False, "No image files found for upload test."

    response = client.post(
        "/photos/",
        data={
            "user_id": "test_user",
            "building_addr": "test_building_address_123"
        },
        files=files
    )

    assert response.status_code == 201, f"Upload failed, response content: {response.text}"
    data = response.json()
    assert "message" in data
    assert "uploaded_photos" in data
    assert len(data["uploaded_photos"]) == len(files), "Should upload all specified photos"

    print("Multiple photo upload return data:", data)
    print(f"Successfully uploaded {len(data['uploaded_photos'])} Photos")

    user_photos_response = client.get("/photos/user/test_user")
    assert user_photos_response.status_code == 200, f"Failed to get user photos after upload: {user_photos_response.text}"
    user_photos = user_photos_response.json()

    uploaded_photo_ids = {p['photo_id'] for p in data["uploaded_photos"]}
    retrieved_photo_ids = {p['photo_id'] for p in user_photos}
    assert uploaded_photo_ids.issubset(retrieved_photo_ids), "User photo list should contain all newly uploaded photos."

    return data["uploaded_photos"]

def test_get_user_photos():
    print("\n--- Running test_get_user_photos ---")
    # This test now depends on the /photos/user/{user_id} endpoint existing.
    response = client.get("/photos/user/test_user")
    assert response.status_code == 200, f"Failed to get user photos: {response.text}"
    assert isinstance(response.json(), list)
    print("Get a list of photos for test_user:", response.json())

#
# def test_get_batch_pending_photos_and_mark_reviewing():
#     print("\n--- Running test_get_batch_pending_photos_and_mark_reviewing ---")
#     # This endpoint now expects a JSON body with reviewer_id
#     response = client.post(
#         "/photos/review/batch_fetch",
#         json={"reviewer_id": TEST_REVIEWER_ID}
#     )
#
#     if response.status_code == 404:
#         print("ℹ No pending photos to review at this moment.")
#         return []
#
#     assert response.status_code == 200, f"Failed to fetch batch photos: {response.text}"
#     batch = response.json()
#     assert isinstance(batch, list)
#     assert len(batch) > 0, "Expected to retrieve at least one photo."
#
#     for photo in batch:
#         assert photo["status"] == "reviewing"
#         assert photo["reviewer_id"] == TEST_REVIEWER_ID
#     print(f" Retrieved and marked {len(batch)} photos as 'reviewing' by {TEST_REVIEWER_ID}")
#     return batch
#
#
# # --- Test Single Photo Review ---
# def test_review_single_photo():
#     print("\n--- Running test_review_single_photo ---")
#     # First, ensure there's a photo for this reviewer to pick up
#     reviewing_photos = test_get_batch_pending_photos_and_mark_reviewing()
#
#     if not reviewing_photos:
#         print("Skipping single photo review test: No photos were available for review.")
#         return
#
#     photo_to_review = reviewing_photos[0]
#     photo_id_to_review = photo_to_review["photo_id"]
#     reviewer_id_assigned = photo_to_review["reviewer_id"]
#
#     response = client.post(
#         "/photos/review/single",
#         data={  # Send form data
#             "photo_id": photo_id_to_review,
#             "status_result": "success",
#             "feedback": "Test single review passed",
#             "reviewer_id": reviewer_id_assigned
#         }
#     )
#
#     assert response.status_code == 200, f"Single review failed, response content: {response.text}"
#     reviewed_photo_data = response.json()
#     assert reviewed_photo_data["photo_id"] == photo_id_to_review
#     assert reviewed_photo_data["status"] == "approved"
#     assert reviewed_photo_data["feedback"] == "Test single review passed"
#     print("Audit Results (Single):", reviewed_photo_data)
#     print(f" Photo {photo_id_to_review} successfully reviewed as 'approved'.")
#
# def test_batch_review_photos():
#     print("\n--- Running test_batch_review_photos ---")
#     photos_for_batch_review = test_get_batch_pending_photos_and_mark_reviewing()
#
#     if len(photos_for_batch_review) < 2:
#         print("Skipping batch review test: Not enough photos available for batch review.")
#         return
#
#     ids_to_batch_review = [p["photo_id"] for p in photos_for_batch_review[:2]]
#     reviewer_id = photos_for_batch_review[0]["reviewer_id"]
#
#     response = client.post(
#         "/photos/review/batch_submit",
#         data={  # Send form data
#             "photo_ids": ",".join(ids_to_batch_review),
#             "result": "success",
#             "feedback": "Test batch review passed",
#             "reviewer_id": reviewer_id
#         }
#     )
#
#     assert response.status_code == 200, f"Batch review failed, response content: {response.text}"
#     reviewed_photos_data = response.json()
#     assert isinstance(reviewed_photos_data, list)
#     assert len(reviewed_photos_data) == len(ids_to_batch_review)
#
#     for photo in reviewed_photos_data:
#         assert photo["status"] == "approved"
#         assert photo["feedback"] == "Test batch review passed"
#         assert photo["photo_id"] in ids_to_batch_review
#
#     print(f" Successfully batch reviewed {len(reviewed_photos_data)} photos as 'approved'.")
#
# def test_release_all_photos():
#     print("\n--- Running test_release_all_photos ---")
#     # First, ensure some photos are in 'reviewing' state for this reviewer
#     test_get_batch_pending_photos_and_mark_reviewing()
#
#     response = client.post(
#         "/photos/review/release_all",
#         data={"reviewer_id": TEST_REVIEWER_ID}  # Send as form data
#     )
#
#     assert response.status_code == 200, f"Release all photos failed: {response.text}"
#
#     # --- CHANGE THIS LINE TO MAKE THE ASSERTION MORE FLEXIBLE ---
#     # Check if the message starts with "Successfully released" and contains "photos back to pending."
#     actual_message = response.json()["message"]
#     assert actual_message.startswith("Successfully released") and \
#            actual_message.endswith("photos back to pending."), \
#         f"Unexpected message received: {actual_message}"
#
#     print(" All photos assigned to reviewer released.")
#
#     # Optional: Try to fetch photos again to confirm they are no longer assigned
#     response_after_release = client.post(
#         "/photos/review/batch_fetch",
#         json={"reviewer_id": TEST_REVIEWER_ID}
#     )
#     if response_after_release.status_code == 404:
#         print("Confirmed: No pending photos found after release, which is expected if all were released.")
#     elif response_after_release.status_code == 200:
#         print(f"Confirmed: New batch fetched after release, containing {len(response_after_release.json())} photos.")
#     else:
#         print(f"Unexpected status after release: {response_after_release.status_code}, {response_after_release.text}")