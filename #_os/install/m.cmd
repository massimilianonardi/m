@echo off


rem ----------------------------------------------------------------------------
rem set variables independent from windows architecture

pushd "%~dp0"
set PKG_DIR=%CD%\pkg
set INIT_DIR=%CD%\pkg\m\bin
popd



rem ----------------------------------------------------------------------------
rem detect windows architecture

if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
  set ARCH=x86_64
) else (
  if "%PROCESSOR_ARCHITEW6432%"=="AMD64" (
    set ARCH=x86_64
  ) else (
    set ARCH=x86
  )
)

rem set POSIX_SYS_DIR=%PKG_DIR%\cygwin-windows-%ARCH%
set POSIX_SYS_DIR=%PKG_DIR%\git-windows-%ARCH%
set INSTALLED_SH=%POSIX_SYS_DIR%\bin\sh.exe



rem ----------------------------------------------------------------------------
rem dispatch command to sh

set CYGWIN="winsymlinks:nativestrict"
set MSYS="winsymlinks:nativestrict"

set PATH=%POSIX_SYS_DIR%\bin;%POSIX_SYS_DIR%\sbin;%POSIX_SYS_DIR%\usr\bin;%POSIX_SYS_DIR%\usr\sbin;%PATH%
for /f "delims=" %%i in ('cygpath.exe -u "%INIT_DIR%"') do set INIT_DIR=%%i

"%INSTALLED_SH%" "%INIT_DIR%/shell" %*

rem pushd "%INIT_DIR%"
rem "%INSTALLED_SH%" "./shell" %*
rem popd
