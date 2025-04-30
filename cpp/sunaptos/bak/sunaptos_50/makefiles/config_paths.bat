@echo off

set MINGW_HOME=C:\MinGW

set path=%MINGW_HOME%\bin

set working_dir=%cd%
cd /D %~dp0
cd ..\bin
set path=%cd%;%path%
cd /D %working_dir%
