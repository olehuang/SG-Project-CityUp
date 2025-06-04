from datetime import datetime
import dotenv

import db_entities
from db_entities import MongoDB,Building,ReviewStatus
from error_logging import log_error
import traceback

"""
:return a photo list under same address and status= Approved
"""
async def get_all_photos_under_same_address(address:str):
    try:
        collection= MongoDB.get_instance().get_collection('photos')
        query = {
            'building_addr': address,
            'status': ReviewStatus.Approved.value
        }
        photo_list=await (collection
                          .find(query)
                          .sort("upload_time",-1) #Sort descending earlier is first / ascending(1)
                          .to_list(length=None))
        return photo_list or []
    except Exception as e:
        log_error(f'get_all_photos_under_same_address: {e}',
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise

