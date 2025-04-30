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
	${OBJECTDIR}/ipcserver.o \
	${OBJECTDIR}/dlibsrv.o \
	${OBJECTDIR}/ipcclient.o \
	${OBJECTDIR}/dlibobj.o \
	${OBJECTDIR}/dynamiclibraryloader.o \
	${OBJECTDIR}/data.o \
	${OBJECTDIR}/dlibcli.o

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
	${MAKE}  -f nbproject/Makefile-Debug.mk dist/Debug/${PLATFORM}/libcore.dll

dist/Debug/${PLATFORM}/libcore.dll: ${OBJECTFILES}
	${MKDIR} -p dist/Debug/${PLATFORM}
	${LINK.cc} -shared -o dist/Debug/${PLATFORM}/libcore.dll -fPIC ${OBJECTFILES} ${LDLIBSOPTIONS} 

${OBJECTDIR}/ipcserver.o: ipcserver.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/ipcserver.o ipcserver.cpp

${OBJECTDIR}/dlibsrv.o: dlibsrv.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/dlibsrv.o dlibsrv.cpp

${OBJECTDIR}/ipcclient.o: ipcclient.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/ipcclient.o ipcclient.cpp

${OBJECTDIR}/dlibobj.o: dlibobj.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/dlibobj.o dlibobj.cpp

${OBJECTDIR}/dynamiclibraryloader.o: dynamiclibraryloader.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/dynamiclibraryloader.o dynamiclibraryloader.cpp

${OBJECTDIR}/data.o: data.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/data.o data.cpp

${OBJECTDIR}/dlibcli.o: dlibcli.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/dlibcli.o dlibcli.cpp

# Subprojects
.build-subprojects:

# Clean Targets
.clean-conf:
	${RM} -r build/Debug
	${RM} dist/Debug/${PLATFORM}/libcore.dll

# Subprojects
.clean-subprojects:

# Enable dependency checking
.dep.inc: .depcheck-impl

include .dep.inc
