@echo off

set MINGW_HOME=C:\MinGW
rem set MINGW_HOME=F:\PortableAppsPlatform\Apps\NetBeans\MinGW

set path=%MINGW_HOME%\bin

set working_dir=%cd%
cd /D %~dp0
cd ..\bin
set path=%cd%;%path%
cd /D %working_dir%
