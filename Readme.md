#NodeJS API
##Description
Potrzebuję testowo API, które przyjmie pocięty klip video
złoży go i zapisze cały

##Docker
###Uruchomienie

sudo docker-compose up -d

###Zatrzymaj i usuń kontenery
sudo docker-compose down

docker rmi <image_name_or_id>
docker rmi node18_api-video_api
###
sudo docker stop 


###Do pracującego kontenera

sudo docker exec -it node18_api-video_api-1 bash

##Endpoints
POST http://localhost:3000/upload

DELETE http://localhost:3000/clear-chunks

GET http://localhost:3000/merge-video
