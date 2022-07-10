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
GREP=grep
NM=nm
CCADMIN=CCadmin
RANLIB=ranlib
CC=gcc
CCC=g++
CXX=g++
FC=
AS=as

# Macros
CND_PLATFORM=MinGW-Windows
CND_CONF=Release
CND_DISTDIR=dist

# Include project Makefile
include Makefile

# Object Directory
OBJECTDIR=build/${CND_CONF}/${CND_PLATFORM}

# Object Files
OBJECTFILES= \
	${OBJECTDIR}/main.o


# C Compiler Flags
CFLAGS=

# CC Compiler Flags
CCFLAGS=
CXXFLAGS=

# Fortran Compiler Flags
FFLAGS=

# Assembler Flags
ASFLAGS=

# Link Libraries and Options
LDLIBSOPTIONS=-L../core/dist/Release/MinGW-Windows -lcore

# Build Targets
.build-conf: ${BUILD_SUBPROJECTS}
	"${MAKE}"  -f nbproject/Makefile-Release.mk dist/Release/MinGW-Windows/process.exe

dist/Release/MinGW-Windows/process.exe: ../core/dist/Release/MinGW-Windows/core.dll

dist/Release/MinGW-Windows/process.exe: ${OBJECTFILES}
	${MKDIR} -p dist/Release/MinGW-Windows
	${LINK.cc} -o ${CND_DISTDIR}/${CND_CONF}/${CND_PLATFORM}/process ${OBJECTFILES} ${LDLIBSOPTIONS} 

${OBJECTDIR}/main.o: main.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I../core -MMD -MP -MF $@.d -o ${OBJECTDIR}/main.o main.cpp

# Subprojects
.build-subprojects:
	cd ../core && ${MAKE}  -f Makefile CONF=Release
	cd ../KernelMaster && ${MAKE}  -f Makefile CONF=Debug
	cd ../KernelMaster && ${MAKE}  -f Makefile CONF=Release
	cd ../boot && ${MAKE}  -f Makefile CONF=Debug
	cd ../boot && ${MAKE}  -f Makefile CONF=Release
	cd ../simple && ${MAKE}  -f Makefile CONF=Debug
	cd ../simple && ${MAKE}  -f Makefile CONF=Release

# Clean Targets
.clean-conf: ${CLEAN_SUBPROJECTS}
	${RM} -r build/Release
	${RM} dist/Release/MinGW-Windows/process.exe

# Subprojects
.clean-subprojects:
	cd ../core && ${MAKE}  -f Makefile CONF=Release clean
	cd ../KernelMaster && ${MAKE}  -f Makefile CONF=Debug clean
	cd ../KernelMaster && ${MAKE}  -f Makefile CONF=Release clean
	cd ../boot && ${MAKE}  -f Makefile CONF=Debug clean
	cd ../boot && ${MAKE}  -f Makefile CONF=Release clean
	cd ../simple && ${MAKE}  -f Makefile CONF=Debug clean
	cd ../simple && ${MAKE}  -f Makefile CONF=Release clean

# Enable dependency checking
.dep.inc: .depcheck-impl

include .dep.inc
