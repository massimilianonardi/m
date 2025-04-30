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
CND_PLATFORM=GNU-Linux-x86
CND_CONF=Release
CND_DISTDIR=dist
CND_BUILDDIR=build

# Include project Makefile
include Makefile

# Object Directory
OBJECTDIR=${CND_BUILDDIR}/${CND_CONF}/${CND_PLATFORM}

# Object Files
OBJECTFILES= \
	${OBJECTDIR}/sequence.o \
	${OBJECTDIR}/streaminput.o \
	${OBJECTDIR}/_ext/430067393/fileinputstream.o \
	${OBJECTDIR}/service.o \
	${OBJECTDIR}/_ext/430067393/fileoutputstream.o \
	${OBJECTDIR}/serviceclient.o \
	${OBJECTDIR}/buffer.o \
	${OBJECTDIR}/sharedmemory.o \
	${OBJECTDIR}/lock.o \
	${OBJECTDIR}/streamoutput.o \
	${OBJECTDIR}/streamable.o \
	${OBJECTDIR}/dynamiclibraryloader.o \
	${OBJECTDIR}/thread.o \
	${OBJECTDIR}/serviceserver.o \
	${OBJECTDIR}/sharedmemorystream.o \
	${OBJECTDIR}/kernel.o \
	${OBJECTDIR}/exception.o \
	${OBJECTDIR}/dynamiclibrarymanager.o \
	${OBJECTDIR}/functions.o


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
	${LINK.cc} -shared -o ${CND_OUTPUTPATH}/${CND_OUTPUTFILENAME} -fPIC ${OBJECTFILES} ${LDLIBSOPTIONS} 

${OBJECTDIR}/sequence.o: sequence.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/sequence.o sequence.cpp

${OBJECTDIR}/streaminput.o: streaminput.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/streaminput.o streaminput.cpp

${OBJECTDIR}/fileinputstream.o: fileinputstream.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/fileinputstream.o fileinputstream.cpp

${OBJECTDIR}/service.o: service.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/service.o service.cpp

${OBJECTDIR}/fileoutputstream.o: fileoutputstream.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/fileoutputstream.o fileoutputstream.cpp

${OBJECTDIR}/serviceclient.o: serviceclient.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/serviceclient.o serviceclient.cpp

${OBJECTDIR}/buffer.o: buffer.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/buffer.o buffer.cpp

${OBJECTDIR}/sharedmemory.o: sharedmemory.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/sharedmemory.o sharedmemory.cpp

${OBJECTDIR}/lock.o: lock.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/lock.o lock.cpp

${OBJECTDIR}/streamoutput.o: streamoutput.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/streamoutput.o streamoutput.cpp

${OBJECTDIR}/streamable.o: streamable.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/streamable.o streamable.cpp

${OBJECTDIR}/dynamiclibraryloader.o: dynamiclibraryloader.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/dynamiclibraryloader.o dynamiclibraryloader.cpp

${OBJECTDIR}/thread.o: thread.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/thread.o thread.cpp

${OBJECTDIR}/serviceserver.o: serviceserver.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/serviceserver.o serviceserver.cpp

${OBJECTDIR}/sharedmemorystream.o: sharedmemorystream.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/sharedmemorystream.o sharedmemorystream.cpp

${OBJECTDIR}/kernel.o: kernel.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/kernel.o kernel.cpp

${OBJECTDIR}/exception.o: exception.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/exception.o exception.cpp

${OBJECTDIR}/dynamiclibrarymanager.o: dynamiclibrarymanager.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/dynamiclibrarymanager.o dynamiclibrarymanager.cpp

${OBJECTDIR}/functions.o: functions.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/functions.o functions.cpp

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
