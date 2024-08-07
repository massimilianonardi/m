#
# Generated Makefile - do not edit!
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

# Macros
PLATFORM=MinGW-Windows

# Include project Makefile
include Makefile

# Object Directory
OBJECTDIR=build/Release/${PLATFORM}

# Object Files
OBJECTFILES= \
	${OBJECTDIR}/dlib.o \
	${OBJECTDIR}/BootLoaderServer.o

# C Compiler Flags
CFLAGS=

# CC Compiler Flags
CCFLAGS=
CXXFLAGS=

# Fortran Compiler Flags
FFLAGS=

# Link Libraries and Options
LDLIBSOPTIONS=-L../core/dist/Release/MinGW-Windows -lcore

# Build Targets
.build-conf: ${BUILD_SUBPROJECTS}
	${MAKE}  -f nbproject/Makefile-Release.mk dist/Release/${PLATFORM}/BootLoaderServer.dlib

dist/Release/${PLATFORM}/BootLoaderServer.dlib: ../core/dist/Release/MinGW-Windows/libcore.dll

dist/Release/${PLATFORM}/BootLoaderServer.dlib: ${OBJECTFILES}
	${MKDIR} -p dist/Release/${PLATFORM}
	${LINK.cc} -shared -o dist/Release/${PLATFORM}/BootLoaderServer.dlib -fPIC ${OBJECTFILES} ${LDLIBSOPTIONS} 

${OBJECTDIR}/dlib.o: dlib.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I../core -I../BootLoader -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/dlib.o dlib.cpp

${OBJECTDIR}/BootLoaderServer.o: BootLoaderServer.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I../core -I../BootLoader -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/BootLoaderServer.o BootLoaderServer.cpp

# Subprojects
.build-subprojects:
	cd ../core && ${MAKE}  -f Makefile CONF=Release

# Clean Targets
.clean-conf: ${CLEAN_SUBPROJECTS}
	${RM} -r build/Release
	${RM} dist/Release/${PLATFORM}/BootLoaderServer.dlib

# Subprojects
.clean-subprojects:
	cd ../core && ${MAKE}  -f Makefile CONF=Release clean

# Enable dependency checking
.dep.inc: .depcheck-impl

include .dep.inc
