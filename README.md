The web software has been successfully containerized using Docker. You only need to clone it to your device.
1. Add a .env file to the backend.
2. Add MONGO_DB_URL=mongodb://admin:cityupadmin@mongo:27017 to the .env file.
3. Open the root directory (the same folder as the frontend and backend), open the command bar and enter "docker compose up -d" and wait for the image to download and run.
4. After the container is running, enter localhost:3000 in your browser to access the homepage.
5. To stop the container, simply enter "docker compose stop."
6. To delete a running container, enter "docker compose down -v" in the command bar.
7. The following is the tile loading method shown in the Upload low picture. It is already included in the container. If you need to replace it, you need to follow the steps below 

The file "tiles" are map tile packages. Please download them here(https://www.dropbox.com/scl/fi/5nmw396ab4mq44i7o4pqp/tiles.rar?rlkey=2xtt6hryohhb06ieqzq9gx2cd&st=obeor8ys&dl=0), extract them, and place them in the public folder within the frontend directory. 
Path looks like:[xxx\SGproject-CityUp\frontend\public] xxx is the folder path where you have stored this project.
Additional Map Tiles (Local Setup)

The tiles folder contains XYZ map tiles for the custom basemap.

Steps1

Download the archive:
https://www.dropbox.com/scl/fi/5nmw396ab4mq44i7o4pqp/tiles.rar?rlkey=2xtt6hryohhb06ieqzq9gx2cd&st=obeor8ys&dl=0

Steps2

Extract it to the project’s public folder:
Windows: ...\SGproject-CityUp\frontend\public\tiles\
macOS/Linux: .../SGproject-CityUp/frontend/public/tiles/

Your final structure should look like:
frontend/public/tiles/
  18/<x>/<y>.png

