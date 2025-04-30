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
OBJECTDIR=build/Debug/${PLATFORM}

# Object Files
OBJECTFILES= \
	${OBJECTDIR}/dlib.o \
	${OBJECTDIR}/srv_sample.o

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
.build-conf: ${BUILD_SUBPROJECTS}
	${MAKE}  -f nbproject/Makefile-Debug.mk dist/Debug/${PLATFORM}/libsrv_sample.dll

dist/Debug/${PLATFORM}/libsrv_sample.dll: ${OBJECTFILES}
	${MKDIR} -p dist/Debug/${PLATFORM}
	${LINK.cc} -shared -o dist/Debug/${PLATFORM}/libsrv_sample.dll -fPIC ${OBJECTFILES} ${LDLIBSOPTIONS} 

${OBJECTDIR}/dlib.o: dlib.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -I../core -I../iface_template -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/dlib.o dlib.cpp

${OBJECTDIR}/srv_sample.o: srv_sample.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -I../core -I../iface_template -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/srv_sample.o srv_sample.cpp

# Subprojects
.build-subprojects:

# Clean Targets
.clean-conf:
	${RM} -r build/Debug
	${RM} dist/Debug/${PLATFORM}/libsrv_sample.dll

# Subprojects
.clean-subprojects:

# Enable dependency checking
.dep.inc: .depcheck-impl

include .dep.inc
