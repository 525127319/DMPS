1. 先把服务先停掉，再删除掉
    docker ps
    docker stop ..
    docker rm ..



docker-compose -f docker-compose-mongodb.yml up -d

5. 数据库： /opt/imcloudep/dockercompose-db
docker-compose -f docker-compose-mongodb.yml up -d