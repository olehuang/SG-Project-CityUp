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

    photos_col = MongoDB.get_instance().get_collection("photos")
    buildings_col = MongoDB.get_instance().get_collection("buildings")

    await photos_col.delete_many({})
    await buildings_col.delete_many({})


    test_photos = [
        {"address": "Photo Address 1", "geo_coords": {"lat": 10, "lng": 20}},
        {"address": "Photo Address 2", "geo_coords": {"lat": 30, "lng": 40}},
        {"address": "Photo Address 3", "geo_coords": {"lat": 50, "lng": 60}},
        {"address": None, "geo_coords": {"lat": 70, "lng": 80}},
    ]
    await photos_col.insert_many(test_photos)

async def test_update_addr_from_photo():
    await setup_test_data()


    await db_buildingEntities.update_addr_from_photo()


    buildings_col = MongoDB.get_instance().get_collection("buildings")
    buildings = await buildings_col.find({}, {"address": 1, "geo_coords": 1, "_id": 0}).to_list(length=None)

    addresses = {b["address"] for b in buildings}

    assert "Photo Address 1" in addresses
    assert "Photo Address 2" in addresses
    assert "Photo Address 3" in addresses
    assert None not in addresses

    print("test_update_addr_from_photo passed.")

if __name__ == "__main__":
    asyncio.run(test_update_addr_from_photo())

if __name__ == "__main__":
    asyncio.run(test_insert())

