@echo off

for /D %%p in (..\code\*) do (
  rd /S /Q %%p\build
  rd /S /Q %%p\dist
)

rd /S /Q bin

REM pause
