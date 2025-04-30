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
LDLIBSOPTIONS=${CND_LINKERLIBOPTS}

# Build Targets
.build-conf: ${BUILD_SUBPROJECTS}
	"${MAKE}"  -f nbproject/Makefile-${CND_CONF}.mk ${CND_OUTPUTPATH}/${CND_OUTPUTFILENAME}

${CND_OUTPUTPATH}/${CND_OUTPUTFILENAME}: ${OBJECTFILES}
	${MKDIR} -p ${CND_OUTPUTPATH}
	${LINK.cc} -shared -o ${CND_OUTPUTPATH}/${CND_OUTPUTFILENAME} -fPIC ${OBJECTFILES} ${LDLIBSOPTIONS} 

${OBJECTDIR}/dlib.o: dlib.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -I../core -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/dlib.o dlib.cpp

${OBJECTDIR}/boot.o: boot.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} $@.d
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -I../core -fPIC  -MMD -MP -MF $@.d -o ${OBJECTDIR}/boot.o boot.cpp

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
