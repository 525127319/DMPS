docker build -f ./Dockerfile2 -t imcloud/dmps:v1 .

docker login docker-registry.imcloudep.com -u imcloud -p IMCloud#docker
docker tag imcloud/dmps:v1 docker-registry.imcloudep.com/imcloud_dmps:v1
docker push docker-registry.imcloudep.com/imcloud_dmps:v1