@echo off

cd /D %~dp0

call config_paths.bat

make -f makefile build

pause
