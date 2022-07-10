@echo off



rem defaults

set SCRIPT_DIR=%~dp0

set CYGWIN_ROOT_DIR=
set CYGWIN_DOWNLOAD_DIR=
set CYGWIN_ARCH=
set CYGWIN_CATEGORIES=
set CYGWIN_PACKAGES=
set CYGWIN_MIRROR=
set CYGWIN_LOCAL_DOWNLOAD=
set CYGWIN_LOCAL_INSTALL=
set CYGWIN_ARGS=
set CYGWIN_PROFILE=

rem set CYGWIN_MIRROR=http://ftp.fau.de/cygwin/



rem parse command line arguments

:loop
if not "%1"=="" (
  if "%1"=="--root" (
    set CYGWIN_ROOT_DIR=%~2
    shift
  )
  if "%1"=="--download" (
    set CYGWIN_DOWNLOAD_DIR=%~2
    shift
  )
  if "%1"=="--arch" (
    set CYGWIN_ARCH=%~2
    shift
  )
  if "%1"=="--categories" (
    set CYGWIN_CATEGORIES=%~2
    shift
  )
  if "%1"=="--packages" (
    set CYGWIN_PACKAGES=%~2
    shift
  )
  if "%1"=="--random-mirror" (
    set CYGWIN_MIRROR=
  )
  if "%1"=="--local-download" (
    set CYGWIN_LOCAL_DOWNLOAD=true
  )
  if "%1"=="--local-install" (
    set CYGWIN_LOCAL_INSTALL=true
  )
  if "%1"=="--cygwin" (
    set CYGWIN_ARGS=%~2
    shift
  )
  if "%1"=="--profile-min" (
    set CYGWIN_PROFILE=min
  )
  if "%1"=="--profile-dev" (
    set CYGWIN_PROFILE=dev
  )
  shift
  goto :loop
)



rem process command line arguments

if "%CYGWIN_ROOT_DIR%"=="" (
  set CYGWIN_ROOT_DIR=%CD%\cygwin
)

if "%CYGWIN_ARCH%"=="" (
  if "%PROCESSOR_ARCHITECTURE%"=="x86" (
    set CYGWIN_ARCH=x86
  ) else (
    set CYGWIN_ARCH=x86_64
  )
)

if "%CYGWIN_ARCH%"=="x86" (
  set CYGWIN_EXE=setup-x86.exe
  set CYGWIN_SETUP_ARCH=x86
) else (
  set CYGWIN_EXE=setup-x86_64.exe
  set CYGWIN_SETUP_ARCH=x86_64
)

if "%CYGWIN_PROFILE%"=="min" (
  set CYGWIN_CATEGORIES=^
Base
  set CYGWIN_PACKAGES=^
p7zip,^
bzip2,^
unzip,^
xz,^
make,^
nano,^
openssh,^
ping,^
less,^
symlinks,^
time,^
upx,^
which,^
wget,^
wput
)

if "%CYGWIN_PROFILE%"=="dev" (
  set CYGWIN_CATEGORIES=^
Base
  set CYGWIN_PACKAGES=^
attr,^
cron,^
cygrunsrv,^
shutdown,^
stow,^
cabextract,^
p7zip,^
unace,^
xz,^
binutils,^
clang,^
clang-analyzer,^
cramfs,^
cygwin-devel,^
dmalloc,^
gcc-core,^
gcc-g++,^
gcc-java,^
gdb,^
make,^
patch,^
w32api-headers,^
w32api-runtime,^
windows-default-manifest,^
xdelta,^
xdelta-devel,^
bvi,^
ed,^
nano,^
shed,^
vim,^
vim-common,^
xxd,^
m4,^
perl,^
perl_autorebase,^
perl_base,^
perl_manpages,^
perl_mods,^
python,^
python3,^
crypt,^
libgcc1,^
libgcj-common,^
libgcj15,^
libiconv2,^
libintl8,^
libstdc++6,^
libuuid1,^
libxdelta2,^
zlib,^
zlib-devel,^
zlib0,^
corkscrew,^
lynx,^
nc,^
nc6,^
openssh,^
ping,^
rsh,^
rsync,^
stunnel,^
whois,^
cfv,^
outguess,^
pwgen,^
steghide,^
posh,^
rxvt,^
tcsh,^
zsh,^
attr,^
procps,^
psmisc,^
rng-tools,^
ascii,^
flip,^
groff,^
less,^
most,^
pcre,^
bsdiff,^
bzip2,^
ccrypt,^
cpio,^
csih,^
cygcheck-dep,^
cygutils-extra,^
ddir,^
ddrescue,^
diffstat,^
diffutils,^
dos2unix,^
duff,^
fcrackzip,^
fdupes,^
flog,^
ipcalc,^
iprint,^
keychain,^
lcab,^
makepasswd,^
mcrypt,^
md5deep,^
mmv,^
patcher,^
patchutils,^
pv,^
rdiff,^
rdiff-backup,^
renameutils,^
since,^
smartmontools,^
symlinks,^
time,^
tree,^
txt2regex,^
upx,^
which,^
wget,^
wput
)

if "%CYGWIN_PROFILE%"=="dev" (
  if "%CYGWIN_ARCH%"=="x86" (
    set CYGWIN_PACKAGES=^
%CYGWIN_PACKAGES%,^
cygwin64,^
cygwin64-binutils,^
cygwin64-bzip2,^
cygwin64-default-manifest,^
cygwin64-gcc-core,^
cygwin64-gcc-g++,^
cygwin64-libtool,^
cygwin64-w32api-headers,^
cygwin64-w32api-runtime
  )

  if "%CYGWIN_ARCH%"=="x86_64" (
    set CYGWIN_PACKAGES=^
%CYGWIN_PACKAGES%,^
cygwin32,^
cygwin32-binutils,^
cygwin32-bzip2,^
cygwin32-default-manifest,^
cygwin32-gcc-core,^
cygwin32-gcc-g++,^
cygwin32-libtool,^
cygwin32-w32api-headers,^
cygwin32-w32api-runtime
  )
)



rem build setup command line

set CYGWIN_COMMAND_LINE="%CYGWIN_ROOT_DIR%\%CYGWIN_EXE%" --arch %CYGWIN_SETUP_ARCH% ^
--package-manager ^
--upgrade-also ^
--quiet-mode ^
--prune-install ^
--delete-orphans ^
--no-admin ^
--no-desktop ^
--no-startmenu ^
--no-shortcuts

if not "%CYGWIN_ROOT_DIR%"=="" (
  set CYGWIN_COMMAND_LINE=%CYGWIN_COMMAND_LINE% --root "%CYGWIN_ROOT_DIR%"
)

if not "%CYGWIN_DOWNLOAD_DIR%"=="" (
  set CYGWIN_COMMAND_LINE=%CYGWIN_COMMAND_LINE% --local-package-dir "%CYGWIN_DOWNLOAD_DIR%"
) else (
  set CYGWIN_COMMAND_LINE=%CYGWIN_COMMAND_LINE% --local-package-dir "%CYGWIN_ROOT_DIR%\download"
)

if not "%CYGWIN_CATEGORIES%"=="" (
  set CYGWIN_COMMAND_LINE=%CYGWIN_COMMAND_LINE% --categories "%CYGWIN_CATEGORIES%"
)

if not "%CYGWIN_PACKAGES%"=="" (
  set CYGWIN_COMMAND_LINE=%CYGWIN_COMMAND_LINE% --packages "%CYGWIN_PACKAGES%"
)

if not "%CYGWIN_MIRROR%"=="" (
  set CYGWIN_COMMAND_LINE=%CYGWIN_COMMAND_LINE% --site "%CYGWIN_MIRROR%"
)

if not "%CYGWIN_LOCAL_DOWNLOAD%"=="" (
  set CYGWIN_COMMAND_LINE=%CYGWIN_COMMAND_LINE% --download
)

if not "%CYGWIN_LOCAL_INSTALL%"=="" (
  set CYGWIN_COMMAND_LINE=%CYGWIN_COMMAND_LINE% --local-install
)

if not "%CYGWIN_ARGS%"=="" (
  set CYGWIN_COMMAND_LINE=%CYGWIN_COMMAND_LINE% %CYGWIN_ARGS%
)



rem get setup

mkdir "%CYGWIN_ROOT_DIR%"

set WEBGET=%CYGWIN_ROOT_DIR%\webget.js

echo.> %WEBGET%

echo var source = WScript.Arguments(0);>> %WEBGET%
echo var target = WScript.Arguments(1);>> %WEBGET%
echo.>> %WEBGET%
echo var whr = WScript.CreateObject("MSXML2.XMLHTTP");>> %WEBGET%
echo whr.Open("GET", source, /*async=*/false);>> %WEBGET%
echo whr.Send();>> %WEBGET%
echo.>> %WEBGET%
echo if(whr.Status === 200)>> %WEBGET%
echo {>> %WEBGET%
echo   var stream = WScript.CreateObject("ADODB.Stream");>> %WEBGET%
echo   stream.Type = 1; // binary>> %WEBGET%
echo   stream.Open();>> %WEBGET%
echo   stream.Write(whr.ResponseBody);>> %WEBGET%
echo   stream.Position = 0;>> %WEBGET%
echo   stream.SaveToFile(target, /*adSaveCreateOverWrite=*/2);>> %WEBGET%
echo   stream.Close();>> %WEBGET%
echo }>> %WEBGET%
echo else>> %WEBGET%
echo {>> %WEBGET%
echo   WScript.Quit(1);>> %WEBGET%
echo }>> %WEBGET%



rem execute setup

"%WEBGET%" "https://www.cygwin.com/%CYGWIN_EXE%" "%CYGWIN_ROOT_DIR%\%CYGWIN_EXE%"

%CYGWIN_COMMAND_LINE%



rem cleanup

if "%CYGWIN_LOCAL_DOWNLOAD%"=="" (
  if "%CYGWIN_DOWNLOAD_DIR%"=="" (
    rd /S /Q "%CYGWIN_ROOT_DIR%\download"
  )
)

rem pause

rem --allow-unsupported-windows       Allow old, unsupported Windows versions
rem -a --arch                         architecture to install (x86_64 or x86)
rem -C --categories                   Specify entire categories to install
rem -o --delete-orphans               remove orphaned packages
rem -A --disable-buggy-antivirus      Disable known or suspected buggy anti virus
rem                                   software packages during execution.
rem -D --download                     Download from internet
rem -f --force-current                select the current version for all packages
rem -h --help                         print help
rem -I --include-source               Automatically include source download
rem -i --ini-basename                 Use a different basename, e.g. "foo",
rem                                   instead of "setup"
rem -U --keep-untrusted-keys          Use untrusted keys and retain all
rem -L --local-install                Install from local directory
rem -l --local-package-dir            Local package directory
rem -m --mirror-mode                  Skip availability check when installing from
rem                                   local directory (requires local directory to
rem                                   be clean mirror!)
rem -B --no-admin                     Do not check for and enforce running as
rem                                   Administrator
rem -d --no-desktop                   Disable creation of desktop shortcut
rem -r --no-replaceonreboot           Disable replacing in-use files on next
rem                                   reboot.
rem -n --no-shortcuts                 Disable creation of desktop and start menu
rem                                   shortcuts
rem -N --no-startmenu                 Disable creation of start menu shortcut
rem -X --no-verify                    Don't verify setup.ini signatures
rem -O --only-site                    Ignore all sites except for -s
rem -M --package-manager              Semi-attended chooser-only mode
rem -P --packages                     Specify packages to install
rem -p --proxy                        HTTP/FTP proxy (host:port)
rem -Y --prune-install                prune the installation to only the requested
rem                                   packages
rem -K --pubkey                       URL of extra public key file (gpg format)
rem -q --quiet-mode                   Unattended setup mode
rem -c --remove-categories            Specify categories to uninstall
rem -x --remove-packages              Specify packages to uninstall
rem -R --root                         Root installation directory
rem -S --sexpr-pubkey                 Extra public key in s-expr format
rem -s --site                         Download site
rem -u --untrusted-keys               Use untrusted keys from last-extrakeys
rem -g --upgrade-also                 also upgrade installed packages
rem    --user-agent                   User agent string for HTTP requests
rem -v --verbose                      Verbose output
rem -W --wait                         When elevating, wait for elevated child
rem                                   process
