@echo off
echo 正在上传最新前端代码到服务器...

echo 步骤1: 进入前端目录
cd /d "%~dp0"

echo 步骤2: 上传文件到服务器
sshpass -p "Mypassword.123" scp -o StrictHostKeyChecking=no dist.zip root@47.116.44.135:/root/

echo 步骤3: SSH连接服务器解压部署
sshpass -p "Mypassword.123" ssh -o StrictHostKeyChecking=no root@47.116.44.135 "rm -rf /var/www/html/* && unzip -o /root/dist.zip -d /var/www/html/ && chmod -R 755 /var/www/html/"

echo 步骤4: 重启Nginx
sshpass -p "Mypassword.123" ssh -o StrictHostKeyChecking=no root@47.116.44.135 "nginx -s reload"

echo.
echo 部署完成！请在手机浏览器访问: http://47.116.44.135
pause
