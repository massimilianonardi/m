@echo off

set MINGW_HOME=C:\mingw-w64-32
set MINGW_HOME=C:\MinGW
set MINGW_HOME=C:\mingw-4.8.1-4

set path=%MINGW_HOME%\bin

set working_dir=%cd%
cd /D %~dp0
cd ..\bin
set path=%cd%;%path%
cd /D %working_dir%
