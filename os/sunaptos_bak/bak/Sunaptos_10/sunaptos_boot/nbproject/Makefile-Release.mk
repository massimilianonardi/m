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
	${OBJECTDIR}/dlib.o \
	${OBJECTDIR}/boot.o


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
LDLIBSOPTIONS=-L../sunaptos_core_library/dist/Debug/MinGW-Windows -lsunaptos_core_library -L../sunaptos_core_library/dist/Release/MinGW-Windows -lsunaptos_core_library

# Build Targets
.build-conf: ${BUILD_SUBPROJECTS}
	"${MAKE}"  -f nbproject/Makefile-Release.mk dist/Release/MinGW-Windows/boot.

dist/Release/MinGW-Windows/boot.: ../sunaptos_core_library/dist/Debug/MinGW-Windows/libsunaptos_core_library.dll

dist/Release/MinGW-Windows/boot.: ../sunaptos_core_library/dist/Release/MinGW-Windows/libsunaptos_core_library.dll

dist/Release/MinGW-Windows/boot.: ${OBJECTFILES}
	${MKDIR} -p dist/Release/MinGW-Windows
	${LINK.cc} -shared -o ${CND_DISTDIR}/${CND_CONF}/${CND_PLATFORM}/boot. ${OBJECTFILES} ${LDLIBSOPTIONS} 

${OBJECTDIR}/dlib.o: dlib.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I../sunaptos_core_library  -MMD -MP -MF $@.d -o ${OBJECTDIR}/dlib.o dlib.cpp

${OBJECTDIR}/boot.o: boot.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I../sunaptos_core_library  -MMD -MP -MF $@.d -o ${OBJECTDIR}/boot.o boot.cpp

# Subprojects
.build-subprojects:
	cd ../sunaptos_core_library && ${MAKE}  -f Makefile CONF=Debug
	cd ../sunaptos_core_library && ${MAKE}  -f Makefile CONF=Release

# Clean Targets
.clean-conf: ${CLEAN_SUBPROJECTS}
	${RM} -r build/Release
	${RM} dist/Release/MinGW-Windows/boot.

# Subprojects
.clean-subprojects:
	cd ../sunaptos_core_library && ${MAKE}  -f Makefile CONF=Debug clean
	cd ../sunaptos_core_library && ${MAKE}  -f Makefile CONF=Release clean

# Enable dependency checking
.dep.inc: .depcheck-impl

include .dep.inc
