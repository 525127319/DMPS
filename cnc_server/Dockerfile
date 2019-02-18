FROM java:8

# RUN apt-get -y update 
# RUN apt-get -y upgrade
# RUN apt-get install -y software-properties-common 
# RUN apt-get install -y python3-software-properties
# RUN add-apt-repository ppa:webupd8team/java
# RUN apt-get -y update && \
#     echo oracle-java7-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
# RUN apt-get install -y oracle-java8-installer
# RUN apt-get clean



RUN java -version

ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ADD ./docker/dms-8741.jar /node-sidecar.jar
RUN bash -c 'touch /node-sidecar.jar'

RUN apt-get install -y unzip

ADD ./docker/node8.zip /node8.zip
RUN unzip node8.zip
RUN ln -s /node8/bin/node /usr/local/bin/node

ADD ./docker/yarn.zip /yarn.zip
RUN unzip yarn.zip
RUN ln -s /yarn/bin/yarn /usr/local/bin/yarn
RUN ln -s /yarn/bin/yarnpkg /usr/local/bin/yarnpkg

RUN mkdir -p /opt/cnc_server
COPY .  /opt/cnc_server
WORKDIR /opt/cnc_server
RUN rm -rf app.js & rm -rf config/DBConfig.js & rm -rf config/WSConfig.js
RUN cp docker/app.js -rf ./
RUN cp docker/k8s/DBConfig.js -rf ./config/
RUN cp docker/WSConfig.js -rf ./config/

RUN yarn

COPY ./docker/start.sh /opt/cnc_server

RUN ["chmod", "+x", "/opt/cnc_server/start.sh"]
CMD /bin/bash /opt/cnc_server/start.sh
