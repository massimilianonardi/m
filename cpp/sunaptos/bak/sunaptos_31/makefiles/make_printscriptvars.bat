@echo off

cd /D %~dp0

call config_paths.bat
call config_target.bat

make -f makefile printscriptvars CONF=%CONF% TARGET_CPU=%TARGET_CPU% TARGET_OS=%TARGET_OS% TARGET_ARCH=%TARGET_ARCH% SYS_COMPILER=%SYS_COMPILER%

pause
