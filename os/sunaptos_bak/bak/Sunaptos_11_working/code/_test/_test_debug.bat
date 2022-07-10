rd /S /Q bin
mkdir bin
cd bin

copy /Y ..\..\process\dist\Debug\MinGW-Windows\*.*
copy /Y ..\..\core\dist\Debug\MinGW-Windows\*.*
copy /Y ..\..\KernelMaster\dist\Debug\MinGW-Windows\*.*
copy /Y ..\..\boot\dist\Debug\MinGW-Windows\*.*
copy /Y ..\..\simple\dist\Debug\MinGW-Windows\*.*

process KernelMaster 0 a 0 a

pause
