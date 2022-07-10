rd /S /Q bin
mkdir bin
cd bin

copy /Y ..\..\process\dist\Release\MinGW-Windows\*.*
copy /Y ..\..\core\dist\Release\MinGW-Windows\*.*
copy /Y ..\..\KernelMaster\dist\Release\MinGW-Windows\*.*
copy /Y ..\..\boot\dist\Release\MinGW-Windows\*.*
copy /Y ..\..\simple\dist\Release\MinGW-Windows\*.*

process KernelMaster 0 a 0 a

pause
