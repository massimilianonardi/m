@echo off

rem set MINGW_HOME=O:\PortableAppsPlatform\Apps\NetBeans\MinGW
set MINGW_HOME=F:\PortableAppsPlatform\Apps\NetBeans\MinGW
set MINGW_HOME=F:\PortableAppsPlatform\Apps\NetBeans\MinGW__
set MINGW_HOME=C:\mingw
set MINGW_HOME=C:\mingw-4.8.1-4
set MINGW_HOME=C:\cygwin_
set MINGW_HOME=C:\mingw-w64-64
set MINGW_HOME=C:\mingw-w64-32

set path=%MINGW_HOME%\bin;%path%

set working_dir=%cd%
cd /D %~dp0
cd ..\bin
set path=%cd%;%path%
cd /D %working_dir%
