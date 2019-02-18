rm -rf /home/app/dms/web
mkdir -p /home/app/dms/web
cd /home/app/dms/web
git clone  -b dev http://ray:ray123456@code-iacloud.ceway.com.cn/scm/foreend/cnc_web.git
cd cnc_web/
\cp ./docker/ks2/AxiosHttp.js ./src/utils/
npm --registry https://registry.npm.taobao.org install
node ./docker/UpdateDay.js 
npm run build
cd ./build
\cp * -rf /opt/nginx/dms/
service nginx restart




###复制本到到远程
\cp ./docker/ks2/AxiosHttp.js ./src/utils/

node ./docker/UpdateDay.js 
npm run build

scp build.zip root@10.131.212.70:/home/app/cnc.zip

login to server 10.131.212.70


cd /home/app/
unzip cnc.zip
cd build
\cp * -rf /opt/nginx/dms/
service nginx restart