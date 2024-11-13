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

sudo docker stop 

###Wejście do pracującego kontenera

sudo docker exec -it {container-name} bash

sudo docker exec -it node18_api-video_api-1 bash

##Endpoints
###POST | upload klipu video
POST http://localhost:3000/upload

###DELETE | czyszczenie folderów Chunks oraz Output

DELETE http://localhost:3000/clear-chunks

###POST | scalenie poszczególnych przyczynków video, w jeden plik

POST http://localhost:3000/merge-video
