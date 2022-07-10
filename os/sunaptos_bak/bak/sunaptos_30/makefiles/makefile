.PHONY: all clean clean_project build build_dirs build_project build_project_dir install printallvars printenvvars printscriptvars

# TODO: if source file name ends with .cpp, then compile with g++, if ends with .c, then compile with gcc. generate CPPSOURCES, CSOURCES, CPPOBJS, COBJS to achieve that.
# TODO: different project options for different targets (eg: different file extensions for windows and linux)

################################################################################
### GLOBAL VARIABLES
################################################################################

PROJECTS_HI_PRI=core
PROJECTS_LO_PRI=



################################################################################
### PROJECT VARIABLES
################################################################################

# defaults
#OUTPUT_FILE_EXTENSION=.dll
OUTPUT_FILE_EXTENSION=.
#INCLUDES=-I../dir1 -I../dir2 -I../dir3
INCLUDES=-I../src/core
#LINKER_LIBRARIES=-L$(EXTERN_LIBRARIES_SEARCH_DIR) -Ldir1 -Ldir2 -Ldir3 -lLib1 -dynamic -lLib2 -dynamic -lLib3 -dynamic
LINKER_LIBRARIES=-lcore -dynamic
LINK_AS_SHARED_LIBRARY=-shared

# project specific options
#PROJECT_01_OUTPUT_FILE_EXTENSION=
#PROJECT_01_INCLUDES=-I../dir1 -I../dir2 -I../dir3
#PROJECT_01_LINKER_LIBRARIES=-L$(EXTERN_LIBRARIES_SEARCH_DIR) -Ldir1 -Ldir2 -Ldir3 -lLib1 -dynamic -lLib2 -dynamic -lLib3 -dynamic
#PROJECT_01_LINK_AS_SHARED_LIBRARY=-shared

core_OUTPUT_FILE_EXTENSION=.dll
core_INCLUDES=
core_LINKER_LIBRARIES=-static-libgcc -static-libstdc++
core_LINK_AS_SHARED_LIBRARY=-shared

process_OUTPUT_FILE_EXTENSION=.exe
process_LINK_AS_SHARED_LIBRARY=

test_OUTPUT_FILE_EXTENSION=.exe
test_LINK_AS_SHARED_LIBRARY=



################################################################################
### SCRIPT VARIABLES
################################################################################

# system
SYS_ENV_VARS := $(.VARIABLES)
SYS_OS=
SYS_CPU=
ifeq ($(OS),Windows_NT)
  SYS_OS=WIN_UNDEFINED
  SYS_CPU=CPU_UNDEFINED
  ifeq ($(PROCESSOR_ARCHITECTURE),AMD64)
    SYS_OS=WIN64
    SYS_CPU=AMD64
  endif
  ifeq ($(PROCESSOR_ARCHITECTURE),x86)
    SYS_OS=WIN32
    SYS_CPU=AMD32
  endif
  ifeq ($(PROCESSOR_ARCHITEW6432),AMD64)
    SYS_OS=WIN64
    SYS_CPU=AMD64
  endif
else
  UNAME_S:=$(shell uname -s)
  ifeq ($(UNAME_S),Linux)
    SYS_OS=LINUX
  endif
  ifeq ($(UNAME_S),Darwin)
    SYS_OS=OSX
  endif
  UNAME_P:=$(shell uname -p)
  ifeq ($(UNAME_P),x86_64)
    SYS_CPU=AMD64
  endif
  ifneq ($(filter %86,$(UNAME_P)),)
    SYS_CPU=x86
  endif
  ifneq ($(filter arm%,$(UNAME_P)),)
    SYS_CPU=ARM
  endif
endif
SYS_COMPILER=GCC
ifeq ($(OS),Windows_NT)
	SYS_COMPILER=MinGW
endif
SYS_TARGET=$(SYS_CPU)_$(SYS_OS)_$(SYS_COMPILER)
ifeq ($(CONF),)
  CONF=RELEASE
endif
PLATFORM=$(SYS_TARGET)

# directories and files
BASE_DIR:=$(shell cd ..; pwd)
#BASE_DIR:=..
SOURCE_DIR=$(BASE_DIR)/src
BUILD_DIR=$(BASE_DIR)/build/$(CONF)/$(PLATFORM)
DIST_DIR=$(BASE_DIR)/dist/$(CONF)/$(PLATFORM)
PROJECTS=$(PROJECTS_HI_PRI) $(filter-out $(PROJECTS_HI_PRI) $(PROJECTS_LO_PRI), $(shell cd $(SOURCE_DIR); find . -mindepth 1 -maxdepth 1 -type d | sed 's|^\./||g')) $(PROJECTS_LO_PRI)
ifneq ($(PROJECT),)
  PROJECT_OUTPUT_FILENAME=$(DIST_DIR)/$(PROJECT)$(OUTPUT_FILE_EXTENSION)
  PROJECT_DIR=$(SOURCE_DIR)/$(PROJECT)
  SOURCE_FILES=$(shell find $(PROJECT_DIR) -name "*.cpp" -o -name "*.c")
  OBJECT_FILES=$(patsubst $(PROJECT_DIR)%, $(BUILD_DIR)/$(PROJECT)%, $(addsuffix .o, $(SOURCE_FILES)))
  DEPENDANCY_FILES=$(wildcard $(addsuffix .d, $(OBJECT_FILES)))
  ifneq ($(origin $(PROJECT)_OUTPUT_FILE_EXTENSION), undefined)
    OUTPUT_FILE_EXTENSION=$($(PROJECT)_OUTPUT_FILE_EXTENSION)
  endif
  ifneq ($(origin $(PROJECT)_INCLUDES), undefined)
    INCLUDES=$($(PROJECT)_INCLUDES)
  endif
  ifneq ($(origin $(PROJECT)_LINKER_LIBRARIES), undefined)
    LINKER_LIBRARIES=$($(PROJECT)_LINKER_LIBRARIES)
  endif
  ifneq ($(origin $(PROJECT)_LINK_AS_SHARED_LIBRARY), undefined)
    LINK_AS_SHARED_LIBRARY=$($(PROJECT)_LINK_AS_SHARED_LIBRARY)
  endif
endif

# build environment
MKDIR=mkdir
LINKER_OPTIONS=-Wl,-rpath . -L$(DIST_DIR) $(LINKER_LIBRARIES) $(LINK_AS_SHARED_LIBRARY)



################################################################################
### SCRIPT TARGETS
################################################################################

# clean and build all projects
all: clean build

# clean all projects
clean:
	$(RM) -r $(BUILD_DIR)
	$(RM) -r $(DIST_DIR)

# clean specific project
clean_project:
	$(RM) -r $(BUILD_DIR)/$(PROJECT)
	$(RM) $(DIST_DIR)/$(PROJECT)

# build all projects
build: build_dirs $(PROJECTS)

build_dirs:
	$(MKDIR) -p $(BUILD_DIR)
	$(MKDIR) -p $(DIST_DIR)

$(PROJECTS):
	$(MKDIR) -p $(BUILD_DIR)/$@
	$(MAKE) build_project PROJECT=$@

# build specific project
build_project: $(PROJECT_OUTPUT_FILENAME)

$(PROJECT_OUTPUT_FILENAME): $(OBJECT_FILES)
	$(LINK.cc) -o $(PROJECT_OUTPUT_FILENAME) $(OBJECT_FILES) $(LINKER_OPTIONS)

# build specific file
$(OBJECT_FILES): $(BUILD_DIR)/$(PROJECT)/%.o: $(SOURCE_DIR)/$(PROJECT)/%
	$(RM) $@.d
#	$(CXX) -c -g -std=c++11 -D$(CONF) -D$(SYS_OS) $(INCLUDES) -MMD -MF "$@.d" -o $@ $<
	$(CXX) -c -g -std=c++11 -D$(CONF) -DWIN32 $(INCLUDES) -MMD -MF "$@.d" -o $@ $<
#	$(CXX) -c -g -std=c++11 -D$(CONF) -DLINUX $(INCLUDES) -MMD -MF "$@.d" -o $@ $<

# install
install:

# print all variables
printallvars:
	$(foreach V, $(sort $(.VARIABLES)), $(info $V=$($V)))

# print only environment variables
printenvvars:
	$(foreach V, $(sort $(SYS_ENV_VARS)), $(info $V=$($V)))

# print only this script variables
printscriptvars:
	$(foreach V, $(sort $(.VARIABLES)), $(if $(filter-out environment% default automatic, $(origin $V)), $(info $V=$($V))))

ifneq ($(DEPENDANCY_FILES),)
include $(DEPENDANCY_FILES)
endif
