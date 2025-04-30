#
# Gererated Makefile - do not edit!
#
# Edit the Makefile in the project folder instead (../Makefile). Each target
# has a -pre and a -post target defined where you can add customized code.
#
# This makefile implements configuration specific macros and targets.


# Environment
MKDIR=mkdir
CP=cp
CCADMIN=CCadmin
RANLIB=ranlib
CC=gcc.exe
CCC=g++.exe
CXX=g++.exe
FC=

# Include project Makefile
include Makefile

# Object Directory
OBJECTDIR=build/Release/MinGW-Windows

# Object Files
OBJECTFILES= \
	${OBJECTDIR}/dlib.o \
	${OBJECTDIR}/iface_cli_template.o

# C Compiler Flags
CFLAGS=

# CC Compiler Flags
CCFLAGS=
CXXFLAGS=

# Fortran Compiler Flags
FFLAGS=

# Link Libraries and Options
LDLIBSOPTIONS=

# Build Targets
.build-conf: ${BUILD_SUBPROJECTS} dist/Release/MinGW-Windows/libiface_cli_template.dll

dist/Release/MinGW-Windows/libiface_cli_template.dll: ${OBJECTFILES}
	${MKDIR} -p dist/Release/MinGW-Windows
	${LINK.cc} -shared -o dist/Release/MinGW-Windows/libiface_cli_template.dll -fPIC ${OBJECTFILES} ${LDLIBSOPTIONS} 

${OBJECTDIR}/dlib.o: dlib.cpp 
	${MKDIR} -p ${OBJECTDIR}
	$(COMPILE.cc) -O2 -I../core -I../iface_template -fPIC  -o ${OBJECTDIR}/dlib.o dlib.cpp

${OBJECTDIR}/iface_cli_template.o: iface_cli_template.cpp 
	${MKDIR} -p ${OBJECTDIR}
	$(COMPILE.cc) -O2 -I../core -I../iface_template -fPIC  -o ${OBJECTDIR}/iface_cli_template.o iface_cli_template.cpp

# Subprojects
.build-subprojects:

# Clean Targets
.clean-conf:
	${RM} -r build/Release
	${RM} dist/Release/MinGW-Windows/libiface_cli_template.dll

# Subprojects
.clean-subprojects:
