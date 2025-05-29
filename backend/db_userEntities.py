from datetime import datetime

from db_entities import MongoDB, User
from error_logging import log_error
import traceback





"""
@:param user Props want to storag im DB include user_id, username and email
brief: save user information in DB
"""
async def save_user(user: User):
    try:
        users = await MongoDB.get_instance().get_collection('users')
        await users.insert_one(user.__dict__)
    except Exception as e:
        log_error("Error from save_user : {}".format(e),
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise


"""
@user_id: string
brief: import user_id can delete user from DB
!!! all user information in DB will be deleted !!!
do not easy use it. can maker Error
"""
async def delete_user(user_id: str):
    try:
        query = {"user_id":user_id}
        users = await MongoDB.get_instance().get_collection('users')
        result= await users.delete_one(query)
        return {"delete: deleted successfully": result.deleted_count}
    except Exception as e:
        log_error("Error from delete_user : {}".format(e),
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise

"""
@:user_id: userid
brief: input user_id give back user information
@:return user in DB storaged information
"""
async def get_user(user_id:str):
    query = {"user_id": user_id}
    try:
        users = await MongoDB.get_instance().get_collection('users')
        return await users.find_one(query)
    except Exception as e:
        log_error("Error from get_user : {}".format(e)
                  ,stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise

"""
brief: give back all user information from DB
"""
async def get_all_users():
    try:
        users = await MongoDB.get_instance().get_collection('users')
        return await users.find().to_list()
    except Exception as e:
        log_error("Error from get_all_users : {}".format(e),
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise


"""
@:user_id: userid,which user role will be update
@:role: role= "user"(default)/ "admin"
brief: user role can change from user to admin or reverse
for example: 
if a user wants change to  admin, role = "admin"
if a admin wants change to user, noly need inport user_id
"""
async def update_user_role(user_id:str, role="user"):
    try:
        users = await MongoDB.get_instance().get_collection('users')
        query = {"user_id": user_id}
        neu_valiue={"$set": {"role": role}}
        result = await users.update_one(query, neu_valiue)
        return {"details: user role updated successfully"}
    except Exception as e:
        log_error("Error from update_user_role : {}".format(e),
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now())
        raise


