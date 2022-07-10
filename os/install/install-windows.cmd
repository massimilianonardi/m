@echo off



rem ----------------------------------------------------------------------------
rem set variables independent from windows architecture

pushd "%~dp0"
set INIT_DIR=%CD%
cd ..
cd ..
cd ..
cd ..
set ROOT_DIR=%CD%
set PKG_DIR=%CD%\pkg
popd

rem set INSTALLER=%INIT_DIR%\cygwin-installer.cmd
set INSTALLER=%INIT_DIR%\git-installer.cmd



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
rem ensure minimal cygwin is installed

if not exist "%INSTALLED_SH%" (
  call "%INSTALLER%" --root "%POSIX_SYS_DIR%" --arch "%ARCH%"
rem  xcopy "%INIT_DIR%\fstab" "%POSIX_SYS_DIR%\etc" /Y
  xcopy "%INIT_DIR%\m.cmd" "%ROOT_DIR%" /Y
)



rem ----------------------------------------------------------------------------
rem dispatch command to sh

set PATH=%POSIX_SYS_DIR%\bin;%POSIX_SYS_DIR%\sbin;%POSIX_SYS_DIR%\usr\sbin;%PATH%

pushd "%INIT_DIR%"
set CYGWIN="winsymlinks:nativestrict"
set MSYS="winsymlinks:nativestrict"
rem "%INSTALLED_SH%" "./install" "dev"
"%INSTALLED_SH%" "./install"
popd

pause
