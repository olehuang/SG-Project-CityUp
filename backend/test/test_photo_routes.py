import os
import io
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
#
# def test_upload_single_photo():
#     # test_image_content = b"fake image data"
#     # test_file = io.BytesIO(test_image_content)
#     # test_file.name = "test.jpg"
#     with open("F:\Bild\Weixin Image_20250520074752.png", "rb") as f:
#         test_file = io.BytesIO(f.read())
#     test_file.name = "Weixin Image_20250520074752.png"
#
#     response = client.post(
#         "/photos/",
#         data={
#             "user_id": "test_user",
#             "building_id": "test_building"
#         },
#         files={"photo": ("test.jpg", test_file, "image/jpeg")}
#     )
#
#     assert response.status_code == 201, f"Upload failed, response content: {response.text}"
#     data = response.json()
#     assert "photo_id" in data
#     assert "message" in data
#     print("Upload Return：", data)
def test_upload_multiple_photos():
    test_files = []
    image_paths = [
        "F:\\Bild\\Weixin Image_20250520074752.png",
        "F:\\Bild\\Weixin Image_20250521231244.jpg",  # 请确保这些文件存在

    ]
    files = []
    for idx, img_path in enumerate(image_paths):
        if os.path.exists(img_path):
            with open(img_path, "rb") as f:
                content = f.read()
                file_obj = io.BytesIO(content)
                file_name = os.path.basename(img_path)
                files.append(("photos", (file_name, file_obj, "image/png")))
        else:
            print(f"Warning: File does not exist: {img_path}")

    response = client.post(
        "/photos/",
        data={
            "user_id": "test_user",
            "building_id": "test_building"
        },
        files=files
    )

    assert response.status_code == 201, f"Upload failed, response content: {response.text}"
    data = response.json()
    assert "message" in data
    assert "uploaded_photos" in data
    assert len(data["uploaded_photos"]) > 1, "Should upload more than one photo"

    print("Multiple photo upload return data：", data)
    print(f"Successfully uploaded {len(data['uploaded_photos'])} Photos")

    user_photos_response = client.get("/photos/user/test_user")
    assert user_photos_response.status_code == 200
    user_photos = user_photos_response.json()
    assert len(user_photos) >= len(data["uploaded_photos"]), "User photo list should contain all uploaded photos"

    return data["uploaded_photos"]


def test_get_user_photos():
    response = client.get("/photos/user/test_user")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    print("Get a list of photos：", response.json())


def test_review_photo():
    # Get the ID of an existing photo
    response = client.get("/photos/user/test_user")
    assert response.status_code == 200
    photo_list = response.json()
    if not photo_list:
        print("No photos to review")
        return

    photo_id = photo_list[0]["photo_id"]

    response = client.post("/photos/review", json={
        "photo_id": photo_id,
        "status": "approved",
        "feedback": "Test review passed"
    })

    assert response.status_code == 200
    print("Audit Results：", response.json())
