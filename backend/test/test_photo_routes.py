import os
import io
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_upload_photo():
    # test_image_content = b"fake image data"
    # test_file = io.BytesIO(test_image_content)
    # test_file.name = "test.jpg"
    with open("F:\Bild\Weixin Image_20250520074752.png", "rb") as f:
        test_file = io.BytesIO(f.read())
    test_file.name = "Weixin Image_20250520074752.png"

    response = client.post(
        "/photos/",
        data={
            "user_id": "test_user",
            "building_id": "test_building"
        },
        files={"photo": ("test.jpg", test_file, "image/jpeg")}
    )

    assert response.status_code == 201, f"Upload failed, response content: {response.text}"
    data = response.json()
    assert "photo_id" in data
    assert "message" in data
    print("Upload Return：", data)
    # assert upload_response.status_code == 201, f"Upload failed, response content: {upload_response.text}"
    #
    # # 上传成功后，再去请求获取照片列表
    # response = client.get("/photos/user/test_user")
    # assert response.status_code == 200
    # photos = response.json()
    # assert isinstance(photos, list)
    # assert len(photos) > 0  # 断言列表不为空
    # print("获取照片列表：", photos)


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
