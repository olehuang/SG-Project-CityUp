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

    assert response.status_code == 201, f"上传失败，响应内容: {response.text}"
    data = response.json()
    assert "photo_id" in data
    assert "message" in data
    print("上传返回：", data)
    # assert upload_response.status_code == 201, f"上传失败，响应内容: {upload_response.text}"
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
    print("获取照片列表：", response.json())


def test_review_photo():
    # 获取已有照片 ID（实际测试应替换为上传得到的 ID）
    response = client.get("/photos/user/test_user")
    assert response.status_code == 200
    photo_list = response.json()
    if not photo_list:
        print("没有照片可审核")
        return

    photo_id = photo_list[0]["photo_id"]

    response = client.post("/photos/review", json={
        "photo_id": photo_id,
        "status": "approved",
        "feedback": "测试审核通过"
    })

    assert response.status_code == 200
    print("审核结果：", response.json())
