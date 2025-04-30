@echo off

rd /S /Q bin
mkdir bin
cd bin

for /D %%p in (..\..\code\*) do (
  copy /Y %%p\dist\Release\MinGW-Windows\*.*
)

process KernelMaster 0 a 0 a

pause
