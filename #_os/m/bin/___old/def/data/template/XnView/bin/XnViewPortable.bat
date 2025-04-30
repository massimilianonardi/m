@echo off
cd /D %~dp0

del category.db
del category.bak
rmdir /S /Q cache
