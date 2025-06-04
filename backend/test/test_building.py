import asyncio
import dotenv
dotenv.load_dotenv()

from db_entities import MongoDB, Building
import db_buildingEntities

async def test_insert():
    building = Building(address="Test Address", geo_coords={"lat": 1.23, "lng": 4.56})
    await db_buildingEntities.save_building(building)



import asyncio
from db_entities import MongoDB, Building
import db_buildingEntities
from pymongo import ASCENDING

async def setup_test_data():
    # 清理并准备测试用数据
    photos_col = MongoDB.get_instance().get_collection("photos")
    buildings_col = MongoDB.get_instance().get_collection("buildings")

    await photos_col.delete_many({})
    await buildings_col.delete_many({})

    # 插入测试照片数据（带地址和geo_coords）
    test_photos = [
        {"address": "Photo Address 1", "geo_coords": {"lat": 10, "lng": 20}},
        {"address": "Photo Address 2", "geo_coords": {"lat": 30, "lng": 40}},
        {"address": "Photo Address 3", "geo_coords": {"lat": 50, "lng": 60}},
        {"address": None, "geo_coords": {"lat": 70, "lng": 80}},  # 这个不应该被插入
    ]
    await photos_col.insert_many(test_photos)

async def test_update_addr_from_photo():
    await setup_test_data()

    # 调用你要测试的函数
    await db_buildingEntities.update_addr_from_photo()

    # 验证 buildings 集合里是否成功插入了正确数据
    buildings_col = MongoDB.get_instance().get_collection("buildings")
    buildings = await buildings_col.find({}, {"address": 1, "geo_coords": 1, "_id": 0}).to_list(length=None)

    addresses = {b["address"] for b in buildings}

    assert "Photo Address 1" in addresses
    assert "Photo Address 2" in addresses
    assert "Photo Address 3" in addresses
    assert None not in addresses  # 确认无地址项未插入

    print("test_update_addr_from_photo passed.")

if __name__ == "__main__":
    asyncio.run(test_update_addr_from_photo())

if __name__ == "__main__":
    asyncio.run(test_insert())

