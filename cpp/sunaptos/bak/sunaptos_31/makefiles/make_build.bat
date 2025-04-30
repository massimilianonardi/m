@echo off

cd /D %~dp0

call config_paths.bat
call config_target.bat

make -f makefile build CONF=%CONF% TARGET_CPU=%TARGET_CPU% TARGET_OS=%TARGET_OS% TARGET_ARCHITECTURE=%TARGET_ARCHITECTURE% SYS_COMPILER=%SYS_COMPILER%

pause
