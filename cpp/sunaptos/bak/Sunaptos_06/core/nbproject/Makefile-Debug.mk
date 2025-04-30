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
	${OBJECTDIR}/dynamiclibrarymanager.o \
	${OBJECTDIR}/datastring.o \
	${OBJECTDIR}/ipcclient.o \
	${OBJECTDIR}/text.o \
	${OBJECTDIR}/interprocesscommunication.o \
	${OBJECTDIR}/number.o \
	${OBJECTDIR}/buffer.o \
	${OBJECTDIR}/memory.o \
	${OBJECTDIR}/lock.o \
	${OBJECTDIR}/character.o \
	${OBJECTDIR}/datavector.o \
	${OBJECTDIR}/datanumber.o \
	${OBJECTDIR}/dynamiclibraryloader.o \
	${OBJECTDIR}/thread.o \
	${OBJECTDIR}/sequence.o \
	${OBJECTDIR}/dlibcli.o \
	${OBJECTDIR}/sharedmemorystream.o \
	${OBJECTDIR}/ipcserver.o \
	${OBJECTDIR}/charactersequence.o \
	${OBJECTDIR}/dlibsrv.o \
	${OBJECTDIR}/sharedmemory.o \
	${OBJECTDIR}/dlibobj.o

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

${OBJECTDIR}/dynamiclibrarymanager.o: dynamiclibrarymanager.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/dynamiclibrarymanager.o dynamiclibrarymanager.cpp

${OBJECTDIR}/datastring.o: datastring.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/datastring.o datastring.cpp

${OBJECTDIR}/ipcclient.o: ipcclient.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/ipcclient.o ipcclient.cpp

${OBJECTDIR}/text.o: text.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/text.o text.cpp

${OBJECTDIR}/interprocesscommunication.o: interprocesscommunication.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/interprocesscommunication.o interprocesscommunication.cpp

${OBJECTDIR}/number.o: number.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/number.o number.cpp

${OBJECTDIR}/buffer.o: buffer.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/buffer.o buffer.cpp

${OBJECTDIR}/memory.o: memory.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/memory.o memory.cpp

${OBJECTDIR}/lock.o: lock.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/lock.o lock.cpp

${OBJECTDIR}/character.o: character.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/character.o character.cpp

${OBJECTDIR}/datavector.o: datavector.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/datavector.o datavector.cpp

${OBJECTDIR}/datanumber.o: datanumber.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/datanumber.o datanumber.cpp

${OBJECTDIR}/dynamiclibraryloader.o: dynamiclibraryloader.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/dynamiclibraryloader.o dynamiclibraryloader.cpp

${OBJECTDIR}/thread.o: thread.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/thread.o thread.cpp

${OBJECTDIR}/sequence.o: sequence.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/sequence.o sequence.cpp

${OBJECTDIR}/dlibcli.o: dlibcli.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/dlibcli.o dlibcli.cpp

${OBJECTDIR}/sharedmemorystream.o: sharedmemorystream.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/sharedmemorystream.o sharedmemorystream.cpp

${OBJECTDIR}/ipcserver.o: ipcserver.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/ipcserver.o ipcserver.cpp

${OBJECTDIR}/charactersequence.o: charactersequence.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/charactersequence.o charactersequence.cpp

${OBJECTDIR}/dlibsrv.o: dlibsrv.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/dlibsrv.o dlibsrv.cpp

${OBJECTDIR}/sharedmemory.o: sharedmemory.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/sharedmemory.o sharedmemory.cpp

${OBJECTDIR}/dlibobj.o: dlibobj.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -g -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/dlibobj.o dlibobj.cpp

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
