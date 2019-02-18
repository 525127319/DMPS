1. 先把服务先停掉，再删除掉
    docker ps
    docker stop ..
    docker rm ..



10.131.212.69
docker login docker-registry.imcloudep.com -u imcloud -p IMCloud#docker
docker pull docker-registry.imcloudep.com/imcloud_dms_dev:v1

10.131.212.70
docker service ls
docker service ls |grep dms | awk '{print $1 }'|xargs docker service rm

docker service rm x45w1i1gp1b1


cd /opt/imcloudep/dockercompose
docker stack deploy -c  docker-compose-dms.yml imcloud-dms