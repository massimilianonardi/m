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
	${OBJECTDIR}/sequence.o \
	${OBJECTDIR}/service.o \
	${OBJECTDIR}/serviceclient.o \
	${OBJECTDIR}/buffer.o \
	${OBJECTDIR}/sharedmemory.o \
	${OBJECTDIR}/lock.o \
	${OBJECTDIR}/dynamiclibraryloader.o \
	${OBJECTDIR}/thread.o \
	${OBJECTDIR}/serviceserver.o \
	${OBJECTDIR}/sharedmemorystream.o \
	${OBJECTDIR}/kernel.o \
	${OBJECTDIR}/interprocesscommunication.o \
	${OBJECTDIR}/dynamiclibrarymanager.o


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
LDLIBSOPTIONS=

# Build Targets
.build-conf: ${BUILD_SUBPROJECTS}
	"${MAKE}"  -f nbproject/Makefile-Release.mk dist/Release/MinGW-Windows/core.dll

dist/Release/MinGW-Windows/core.dll: ${OBJECTFILES}
	${MKDIR} -p dist/Release/MinGW-Windows
	${LINK.cc} -shared -o ${CND_DISTDIR}/${CND_CONF}/${CND_PLATFORM}/core.dll ${OBJECTFILES} ${LDLIBSOPTIONS} 

${OBJECTDIR}/sequence.o: sequence.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2  -MMD -MP -MF $@.d -o ${OBJECTDIR}/sequence.o sequence.cpp

${OBJECTDIR}/service.o: service.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2  -MMD -MP -MF $@.d -o ${OBJECTDIR}/service.o service.cpp

${OBJECTDIR}/serviceclient.o: serviceclient.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2  -MMD -MP -MF $@.d -o ${OBJECTDIR}/serviceclient.o serviceclient.cpp

${OBJECTDIR}/buffer.o: buffer.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2  -MMD -MP -MF $@.d -o ${OBJECTDIR}/buffer.o buffer.cpp

${OBJECTDIR}/sharedmemory.o: sharedmemory.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2  -MMD -MP -MF $@.d -o ${OBJECTDIR}/sharedmemory.o sharedmemory.cpp

${OBJECTDIR}/lock.o: lock.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2  -MMD -MP -MF $@.d -o ${OBJECTDIR}/lock.o lock.cpp

${OBJECTDIR}/dynamiclibraryloader.o: dynamiclibraryloader.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2  -MMD -MP -MF $@.d -o ${OBJECTDIR}/dynamiclibraryloader.o dynamiclibraryloader.cpp

${OBJECTDIR}/thread.o: thread.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2  -MMD -MP -MF $@.d -o ${OBJECTDIR}/thread.o thread.cpp

${OBJECTDIR}/serviceserver.o: serviceserver.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2  -MMD -MP -MF $@.d -o ${OBJECTDIR}/serviceserver.o serviceserver.cpp

${OBJECTDIR}/sharedmemorystream.o: sharedmemorystream.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2  -MMD -MP -MF $@.d -o ${OBJECTDIR}/sharedmemorystream.o sharedmemorystream.cpp

${OBJECTDIR}/kernel.o: kernel.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2  -MMD -MP -MF $@.d -o ${OBJECTDIR}/kernel.o kernel.cpp

${OBJECTDIR}/interprocesscommunication.o: interprocesscommunication.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2  -MMD -MP -MF $@.d -o ${OBJECTDIR}/interprocesscommunication.o interprocesscommunication.cpp

${OBJECTDIR}/dynamiclibrarymanager.o: dynamiclibrarymanager.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2  -MMD -MP -MF $@.d -o ${OBJECTDIR}/dynamiclibrarymanager.o dynamiclibrarymanager.cpp

# Subprojects
.build-subprojects:

# Clean Targets
.clean-conf: ${CLEAN_SUBPROJECTS}
	${RM} -r build/Release
	${RM} dist/Release/MinGW-Windows/core.dll

# Subprojects
.clean-subprojects:

# Enable dependency checking
.dep.inc: .depcheck-impl

include .dep.inc
