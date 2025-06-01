from datetime import datetime
import dotenv
from db_entities import MongoDB, User,Building
from error_logging import log_error
import traceback


"""
@:parameter building : Building object include(building_id, building_address,geo information)
brief: save/create Building Information into DB
"""
async def save_building_or_create(building: Building):
    query={"building_id": building.building_id}
    try:
        buildings=MongoDB.get_instance().get_buildings("buildings")
        result = buildings.find_one(query)
        if result is None:
            new_building=Building(building.building_id, building.address,building.geo_coords)
            neu_building_dict=new_building.__dict__
            await buildings.insert_one(neu_building_dict)
            return neu_building_dict
        else:
            return result
    except Exception as e:
        log_error("Error from save_Building : {}".format(e),
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise


"""
@:parameter string : address of building
brief: whith address can take Building Information from DB
"""
async def take_building_info(address:str):
    query={"address":address}
    try:
        buildings=MongoDB.get_instance().get_buildings("buildings")
        result = await buildings.find_one(query)
        if result is None:
            return -1
        else:
            return result
    except Exception as e:
        log_error("Error from take_building : {}".format(e),
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise


"""
@:parameter string : id of building
brief: whith address can take Building Information from DB
"""
async def take_building_info(id:str):
    query={"building_id":id}
    try:
        buildings=MongoDB.get_instance().get_buildings("buildings")
        result = await buildings.find_one(query)
        if result is None:
            return -1
        else:
            return result
    except Exception as e:
        log_error("Error from take_building : {}".format(e),
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise


"""
brief: give back all Building address from DB
"""
async def take_all_building_address():
    try:
        buildings=MongoDB.get_instance().get_buildings("buildings")
        building_list= await buildings.find().to_list()
        buildings_address_list=[]
        for building in building_list:
            buildings_address_list.append(building["address"])
        return buildings_address_list
    except Exception as e:
        log_error("Error from take_all_building_address : {}".format(e),
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise



