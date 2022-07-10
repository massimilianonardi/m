@echo off



rem defaults

set SCRIPT_DIR=%~dp0

set GIT_ROOT_DIR=
set GIT_ARCH=



rem parse command line arguments

:loop
if not "%1"=="" (
  if "%1"=="--root" (
    set GIT_ROOT_DIR=%~2
    shift
  )
  if "%1"=="--arch" (
    set GIT_ARCH=%~2
    shift
  )
  shift
  goto :loop
)



rem process command line arguments

if "%GIT_ROOT_DIR%"=="" (
  set GIT_ROOT_DIR=%CD%\git
)

if "%GIT_ARCH%"=="" (
  if "%PROCESSOR_ARCHITECTURE%"=="x86" (
    set GIT_ARCH=x86
  ) else (
    set GIT_ARCH=x86_64
  )
)

if "%GIT_ARCH%"=="x86" (
  set GIT_LINK=https://github.com/git-for-windows/git/releases/download/v2.23.0.windows.1/PortableGit-2.23.0-32-bit.7z.exe
) else (
  set GIT_LINK=https://github.com/git-for-windows/git/releases/download/v2.23.0.windows.1/PortableGit-2.23.0-64-bit.7z.exe
)



rem get setup

mkdir "%GIT_ROOT_DIR%"

set GIT_DOWNLOAD_FILE=%GIT_ROOT_DIR%\git.exe

powershell.exe -Command [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest "%GIT_LINK%" -OutFile "%GIT_DOWNLOAD_FILE%"



rem execute setup

"%GIT_DOWNLOAD_FILE%" -o"%GIT_ROOT_DIR%" -y
del "%GIT_DOWNLOAD_FILE%"
