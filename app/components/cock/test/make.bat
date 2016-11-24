@echo off
cd src
node getAreaMap.js
node getPostMap.js

node getPostMap_en.js
node getAreaMap_en.js

node getClassMap.js
node getClassMap_en.js

cd ./..
pause