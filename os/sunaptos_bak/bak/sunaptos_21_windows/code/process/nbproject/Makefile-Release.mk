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
CND_CONF=Release
CND_DISTDIR=dist
CND_BUILDDIR=build

# Include project Makefile
include Makefile

# Object Directory
OBJECTDIR=${CND_BUILDDIR}/${CND_CONF}/${CND_PLATFORM}

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
LDLIBSOPTIONS=${CND_LINKERLIBOPTS}

# Build Targets
.build-conf: ${BUILD_SUBPROJECTS}
	"${MAKE}"  -f nbproject/Makefile-${CND_CONF}.mk ${CND_OUTPUTPATH}/${CND_OUTPUTFILENAME}

${CND_OUTPUTPATH}/${CND_OUTPUTFILENAME}: ${OBJECTFILES}
	${MKDIR} -p ${CND_OUTPUTPATH}
	${LINK.cc} -o ${CND_OUTPUTPATH}/${CND_OUTPUTFILENAME} ${OBJECTFILES} ${LDLIBSOPTIONS} -shared

${OBJECTDIR}/main.o: main.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -O2 -I${CND_CPPINCLUDES} -I../core  -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/main.o main.cpp

# Subprojects
.build-subprojects:
	cd ../core && ${MAKE}  -f Makefile CONF=Release
	cd ../simple && ${MAKE}  -f Makefile CONF=Release
	cd ../KernelMaster && ${MAKE}  -f Makefile CONF=Release
	cd ../boot && ${MAKE}  -f Makefile CONF=Release
	cd ../FileSystem && ${MAKE}  -f Makefile CONF=Release

# Clean Targets
.clean-conf: ${CLEAN_SUBPROJECTS}
	${RM} -r ${CND_BUILDDIR}/${CND_CONF}
	${RM} ${CND_OUTPUTPATH}/${CND_OUTPUTFILENAME}

# Subprojects
.clean-subprojects:
	cd ../core && ${MAKE}  -f Makefile CONF=Release clean
	cd ../simple && ${MAKE}  -f Makefile CONF=Release clean
	cd ../KernelMaster && ${MAKE}  -f Makefile CONF=Release clean
	cd ../boot && ${MAKE}  -f Makefile CONF=Release clean
	cd ../FileSystem && ${MAKE}  -f Makefile CONF=Release clean

# Enable dependency checking
.dep.inc: .depcheck-impl

include .dep.inc
