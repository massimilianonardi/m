@echo off

rd /S /Q bin
mkdir bin
cd bin

for /D %%p in (..\..\code\*) do (
  copy /Y %%p\dist\Debug\MinGW-Windows\*.*
)

process KernelMaster 0 a 0 a

pause
