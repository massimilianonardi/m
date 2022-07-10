.PHONY: all clean clean_target clean_project build build_dirs build_project build_project_dir install printallvars printenvvars printscriptvars

# TODO: if source file name ends with .cpp, then compile with g++, if ends with .c, then compile with gcc. generate CPPSOURCES, CSOURCES, CPPOBJS, COBJS to achieve that.
# TODO: different project options for different targets (eg: different file extensions for windows and linux)

################################################################################
### PROJECT VARIABLES
################################################################################

include makefile_project_variables.mk


################################################################################
### SCRIPT VARIABLES
################################################################################

# system
SYS_ENV_VARS := $(.VARIABLES)
SYS_OS=
SYS_CPU=
SYS_ARCH=
ifeq ($(OS),Windows_NT)
  SYS_OS=WIN_UNDEFINED
  SYS_CPU=CPU_UNDEFINED
  SYS_ARCH=CPU_UNDEFINED
  ifeq ($(PROCESSOR_ARCHITECTURE),AMD64)
    SYS_OS=WIN
    SYS_CPU=AMD64
    SYS_ARCH=64
  endif
  ifeq ($(PROCESSOR_ARCHITECTURE),x86)
    SYS_OS=WIN
    SYS_CPU=x86
    SYS_ARCH=32
  endif
  ifeq ($(PROCESSOR_ARCHITEW6432),AMD64)
    SYS_OS=WIN
    SYS_CPU=AMD64
    SYS_ARCH=32
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
    SYS_ARCH=64
  endif
  ifneq ($(filter %86,$(UNAME_P)),)
    SYS_CPU=x86
    SYS_ARCH=32
  endif
  ifneq ($(filter arm%,$(UNAME_P)),)
    SYS_CPU=ARM
    SYS_ARCH=64
  endif
endif
ifeq ($(TARGET_OS),)
  TARGET_OS=$(SYS_OS)
endif
ifeq ($(TARGET_CPU),)
  TARGET_CPU=$(SYS_CPU)
endif
ifeq ($(TARGET_ARCHITECTUREITECTURE),)
  TARGET_ARCHITECTURE=$(SYS_ARCH)
endif
ifeq ($(SYS_COMPILER),)
  SYS_COMPILER=GCC
  ifeq ($(OS),Windows_NT)
#    SYS_COMPILER=Cygwin
    SYS_COMPILER=MinGW
#    SYS_COMPILER=MinGW64
  endif
endif
ifeq ($(CONF),)
  CONF=RELEASE
endif
SYS_TARGET=$(CONF)_$(TARGET_CPU)_$(TARGET_OS)_$(TARGET_ARCHITECTURE)_$(SYS_COMPILER)

# directories and files
BASE_DIR:=$(shell cd ..; pwd)
#BASE_DIR:=..
SOURCE_DIR=$(BASE_DIR)/src
BUILD_DIR_ROOT=$(BASE_DIR)/build
DIST_DIR_ROOT=$(BASE_DIR)/dist
BUILD_DIR=$(BUILD_DIR_ROOT)/$(SYS_TARGET)
DIST_DIR=$(DIST_DIR_ROOT)/$(SYS_TARGET)
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

# clean all
clean:
	$(RM) -r $(BUILD_DIR_ROOT)
	$(RM) -r $(DIST_DIR_ROOT)
	$(MKDIR) -p $(BUILD_DIR_ROOT)
	$(MKDIR) -p $(DIST_DIR_ROOT)

# clean specific target
clean_target:
	$(RM) -r $(BUILD_DIR)
	$(RM) -r $(DIST_DIR)

# clean specific project for current target
clean_project:
	$(RM) -r $(BUILD_DIR)/$(PROJECT)
	$(RM) $(DIST_DIR)/$(PROJECT)

# build all projects for current target
build: build_dirs $(PROJECTS)

build_dirs:
	$(MKDIR) -p $(BUILD_DIR)
	$(MKDIR) -p $(DIST_DIR)

$(PROJECTS):
	$(MKDIR) -p $(BUILD_DIR)/$@
	$(MAKE) build_project PROJECT=$@

# build specific project for current target
build_project: $(PROJECT_OUTPUT_FILENAME)

$(PROJECT_OUTPUT_FILENAME): $(OBJECT_FILES)
	$(LINK.cc) -o $(PROJECT_OUTPUT_FILENAME) $(OBJECT_FILES) $(LINKER_OPTIONS)

# build specific file for current project and target
$(OBJECT_FILES): $(BUILD_DIR)/$(PROJECT)/%.o: $(SOURCE_DIR)/$(PROJECT)/%
	$(RM) $@.d
	$(CXX) -c -g -std=c++11 -D$(CONF) -D$(TARGET_OS) -D$(TARGET_OS)$(TARGET_ARCHITECTURE) $(INCLUDES) -MMD -MF "$@.d" -o $@ $<

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
