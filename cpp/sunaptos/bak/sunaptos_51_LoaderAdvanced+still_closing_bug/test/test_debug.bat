@echo off

cd ../dist/DEBUG_x86_WIN_32_MinGW

xcopy ..\..\libs .\ /Y
rem process KernelMaster 0 a 0 a
rem process Boot 0 a 0 a
process Boot

pause
