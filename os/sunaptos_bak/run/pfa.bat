@echo off

rem takeown /F "%~dp0home\postgres\data-w64" /R /D S
icacls "%~dp0home\postgres\data-w64" /grant Everyone:(OI)(CI)F /T /Q
icacls "%~dp0log\postgres" /grant Everyone:(OI)(CI)F /T /Q
