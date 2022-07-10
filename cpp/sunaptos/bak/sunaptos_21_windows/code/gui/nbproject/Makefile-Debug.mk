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
	${OBJECTDIR}/dlib.o \
	${OBJECTDIR}/gui.o


# C Compiler Flags
CFLAGS=

# CC Compiler Flags
CCFLAGS=`pkg-config --cflags gtk+-2.0` 
CXXFLAGS=`pkg-config --cflags gtk+-2.0` 

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
	${LINK.cc} -o ${CND_OUTPUTPATH}/${CND_OUTPUTFILENAME} ${OBJECTFILES} ${LDLIBSOPTIONS} `pkg-config --libs gtk+-2.0` -shared

${OBJECTDIR}/dlib.o: dlib.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES} -I../core  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/dlib.o dlib.cpp

${OBJECTDIR}/gui.o: gui.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -DDEBUG -I${CND_CPPINCLUDES} -I../core  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/gui.o gui.cpp

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
