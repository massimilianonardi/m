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
FC=gfortran
AS=as

# Macros
CND_PLATFORM=MinGW-Windows
CND_DLIB_EXT=dll
CND_CONF=Debug
CND_DISTDIR=dist
CND_BUILDDIR=build

# Include project Makefile
include Makefile

# Object Directory
OBJECTDIR=${CND_BUILDDIR}/${CND_CONF}/${CND_PLATFORM}

# Object Files
OBJECTFILES= \
	${OBJECTDIR}/buffer.o \
	${OBJECTDIR}/dynamiclibraryloader.o \
	${OBJECTDIR}/dynamiclibrarymanager.o \
	${OBJECTDIR}/exception.o \
	${OBJECTDIR}/fileinputstream.o \
	${OBJECTDIR}/fileoutputstream.o \
	${OBJECTDIR}/functions.o \
	${OBJECTDIR}/kernel.o \
	${OBJECTDIR}/lock.o \
	${OBJECTDIR}/sequence.o \
	${OBJECTDIR}/service.o \
	${OBJECTDIR}/serviceclient.o \
	${OBJECTDIR}/serviceserver.o \
	${OBJECTDIR}/sharedmemory.o \
	${OBJECTDIR}/sharedmemorystream.o \
	${OBJECTDIR}/streamable.o \
	${OBJECTDIR}/streaminput.o \
	${OBJECTDIR}/streamoutput.o \
	${OBJECTDIR}/thread.o


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
LDLIBSOPTIONS=${CND_LINKERLIBOPTS}

# Build Targets
.build-conf: ${BUILD_SUBPROJECTS}
	"${MAKE}"  -f nbproject/Makefile-${CND_CONF}.mk ${CND_OUTPUTPATH}/${CND_OUTPUTFILENAME}

${CND_OUTPUTPATH}/${CND_OUTPUTFILENAME}: ${OBJECTFILES}
	${MKDIR} -p ${CND_OUTPUTPATH}
	${LINK.cc} -o ${CND_OUTPUTPATH}/${CND_OUTPUTFILENAME} ${OBJECTFILES} ${LDLIBSOPTIONS} -shared

${OBJECTDIR}/buffer.o: buffer.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/buffer.o buffer.cpp

${OBJECTDIR}/dynamiclibraryloader.o: dynamiclibraryloader.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/dynamiclibraryloader.o dynamiclibraryloader.cpp

${OBJECTDIR}/dynamiclibrarymanager.o: dynamiclibrarymanager.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/dynamiclibrarymanager.o dynamiclibrarymanager.cpp

${OBJECTDIR}/exception.o: exception.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/exception.o exception.cpp

${OBJECTDIR}/fileinputstream.o: fileinputstream.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/fileinputstream.o fileinputstream.cpp

${OBJECTDIR}/fileoutputstream.o: fileoutputstream.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/fileoutputstream.o fileoutputstream.cpp

${OBJECTDIR}/functions.o: functions.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/functions.o functions.cpp

${OBJECTDIR}/kernel.o: kernel.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/kernel.o kernel.cpp

${OBJECTDIR}/lock.o: lock.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/lock.o lock.cpp

${OBJECTDIR}/sequence.o: sequence.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/sequence.o sequence.cpp

${OBJECTDIR}/service.o: service.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/service.o service.cpp

${OBJECTDIR}/serviceclient.o: serviceclient.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/serviceclient.o serviceclient.cpp

${OBJECTDIR}/serviceserver.o: serviceserver.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/serviceserver.o serviceserver.cpp

${OBJECTDIR}/sharedmemory.o: sharedmemory.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/sharedmemory.o sharedmemory.cpp

${OBJECTDIR}/sharedmemorystream.o: sharedmemorystream.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/sharedmemorystream.o sharedmemorystream.cpp

${OBJECTDIR}/streamable.o: streamable.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/streamable.o streamable.cpp

${OBJECTDIR}/streaminput.o: streaminput.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/streaminput.o streaminput.cpp

${OBJECTDIR}/streamoutput.o: streamoutput.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/streamoutput.o streamoutput.cpp

${OBJECTDIR}/thread.o: thread.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES}  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/thread.o thread.cpp

# Subprojects
.build-subprojects:

# Clean Targets
.clean-conf: ${CLEAN_SUBPROJECTS}
	${RM} -r ${CND_BUILDDIR}/${CND_CONF}
	${RM} ${CND_OUTPUTPATH}/${CND_OUTPUTFILENAME}

# Subprojects
.clean-subprojects:

# Enable dependency checking
.dep.inc: .depcheck-impl

include .dep.inc
