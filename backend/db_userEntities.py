from datetime import datetime
import dotenv
from db_entities import MongoDB, User
from error_logging import log_error
import traceback
BASE_URL = "http://localhost:8000"


"""
@:param user Props want to storag im DB include user_id, username and email
brief: save user information in DB
"""
async def save_user_or_create(user: User):
    query={'user_id': user.user_id}
    try:
        users = MongoDB.get_instance().get_collection('users')
        result = await users.find_one(query)
        if result is None:
            new_user = User(user.user_id, user.username, user.email,user.role)
            new_user_dict = new_user.__dict__
            await users.insert_one(new_user_dict)
            print("save seccessful")
            return new_user_dict
        else:
            return result
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
        users = MongoDB.get_instance().get_collection('users')
        result= await users.delete_one(query)
        return {"delete: deleted successfully": result.deleted_count}
    except Exception as e:
        log_error("Error from delete_user : {}".format(e),
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now().isoformat())
        raise

"""
@:user_id: userid
brief: input user_id give back user information
@:return user in DB storaged information
"""
async def get_user(user_id:str):
    query = {"user_id": user_id}
    try:
        users = MongoDB.get_instance().get_collection('users')
        user= await users.find_one(query)
        return user
    except Exception as e:
        log_error("Error from get_user : {}".format(e)
                  ,stack_data=traceback.format_exc(),
                  time_stamp=datetime.now().isoformat())
        raise

async def get_user_role_in_DB(user_id:str):
    query = {"user_id":user_id}
    try:
        user=await get_user(user_id)
        return user['role']
    except Exception as e:
        log_error("Error from get_user : {}".format(e)
                  ,stack_data=traceback.format_exc(),
                  time_stamp=datetime.now().isoformat())
        raise


"""
brief: give back all user information from DB
"""
async def get_all_users():
    try:
        users = MongoDB.get_instance().get_collection('users')
        return await users.find().to_list()
    except Exception as e:
        log_error("Error from get_all_users : {}".format(e),
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now().isoformat())
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
        users = MongoDB.get_instance().get_collection('users')
        query = {"user_id": user_id}
        neu_valiue={"$set": {"role": role}}
        result = await users.update_one(query, neu_valiue)
        return {
            "message": "User role updated successfully",
            "matched_count": result.matched_count,
            "modified_count": result.modified_count
        }
    except Exception as e:
        log_error("Error from update_user_role : {}".format(e),
                  stack_data=traceback.format_exc(),
                  time_stamp=datetime.now().isoformat())
        raise


if __name__ == '__main__':
    dotenv.load_dotenv()