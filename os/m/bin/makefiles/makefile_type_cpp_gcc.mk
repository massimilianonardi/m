################################################################################
### INCLUDE
################################################################################

#MAKEFILE_DIR:=$(shell dirname "$(strip $(MAKEFILE_LIST))" | sed 's/ /\\ /g')
#include $(MAKEFILE_DIR)/makefile.conf
.PHONY: clean build



################################################################################
### CPP/GCC
################################################################################



# includes
include $(MAKEFILE_DIR)/defaults_system.conf



# defaults
ifeq ($(TARGET_CONF),)
  TARGET_CONF=RELEASE
endif
ifeq ($(TARGET_OS),)
  TARGET_OS=$(SYS_OS)
endif
ifeq ($(TARGET_CPU),)
  TARGET_CPU=$(SYS_CPU)
endif
ifeq ($(TARGET_ARCHITECTURE),)
  TARGET_ARCHITECTURE=$(SYS_ARCH)
endif

ifeq ($(CC),)
  CC:=gcc
endif
ifeq ($(CXX),)
  CXX:=g++
endif
ifeq ($(CPP),)
  CPP:=$(CC) -E
endif

ifeq ($(SYS_OS),LINUX)
  SYS_COMPILER=GCC
  COMPILER_PREFIX=
#  CC:=gcc
#  CXX:=g++
#  CPP:=$(CC) -E
endif

ifeq ($(SYS_OS),WIN)
  ifeq ($(TARGET_OS),WIN)
    SYS_COMPILER=MinGW-w64
    ifeq ($(TARGET_ARCHITECTURE),32)
      COMPILER_PREFIX=i686-w64-mingw32
    endif
    ifeq ($(TARGET_ARCHITECTURE),64)
      COMPILER_PREFIX=x86_64-w64-mingw32
    endif
  endif
  ifeq ($(TARGET_OS),LINUX)
    SYS_COMPILER=gcc-cygwin
    ifeq ($(TARGET_ARCHITECTURE),32)
      COMPILER_PREFIX=i686-pc-cygwin
    endif
    ifeq ($(TARGET_ARCHITECTURE),64)
      COMPILER_PREFIX=x86_64-pc-cygwin
    endif
  endif
endif

ifneq ($(COMPILER_PREFIX),)
  CC:=$(COMPILER_PREFIX)-gcc
  CXX:=$(COMPILER_PREFIX)-$(CXX)
  CPP:=$(COMPILER_PREFIX)-$(CPP)
endif

# defines
CPPFLAGS=-D$(TARGET_CONF) -D$(TARGET_OS) -D$(TARGET_OS)$(TARGET_ARCHITECTURE)
# windows 64 also requires "WIN32" to be defined
ifeq ($(TARGET_OS), WIN)
  ifeq ($(TARGET_ARCHITECTURE), 64)
    CPPFLAGS+=-DWIN32
  endif
endif

# configurations
ifeq ($(TARGET_CONF),DEBUG)
  CFLAGS=-g
  CXXFLAGS=-g
  #LDFLAGS=-Wl,--verbose
endif

ifeq ($(TARGET_CONF),RELEASE)
  #LDFLAGS=-Wl,--strip-debug
endif

# os specific flags
ifeq ($(TARGET_OS),LINUX)
  ifeq ($(TARGET_ARCHITECTURE),32)
    TARGET_ARCH=-m32
  endif
  ifeq ($(TARGET_ARCHITECTURE),64)
    TARGET_ARCH=-m64
  endif
endif



# build variables
SOURCE_DIRS=$(shell find $(SOURCE_DIR) -mindepth 0 -type d)
OBJECT_DIRS=$(patsubst $(SOURCE_DIR)%, $(BUILD_DIR)%, $(SOURCE_DIRS))
SOURCE_FILES=$(shell find $(SOURCE_DIR) -name "*.cpp" -o -name "*.c")
OBJECT_FILES=$(patsubst $(SOURCE_DIR)%, $(BUILD_DIR)%, $(addsuffix .o, $(SOURCE_FILES)))
SOURCE_FILES_C=$(shell find $(SOURCE_DIR) -name "*.c")
OBJECT_FILES_C=$(patsubst $(SOURCE_DIR)%, $(BUILD_DIR)%, $(addsuffix .o, $(SOURCE_FILES_C)))
SOURCE_FILES_CXX=$(shell find $(SOURCE_DIR) -name "*.cpp")
OBJECT_FILES_CXX=$(patsubst $(SOURCE_DIR)%, $(BUILD_DIR)%, $(addsuffix .o, $(SOURCE_FILES_CXX)))
DEPENDANCY_FILES=$(wildcard $(addsuffix .d, $(OBJECT_FILES)))
ifeq ($(CPP_FILENAME),)
  CPP_FILENAME=$(PROJECT)
endif
PROJECT_OUTPUT_FILENAME=$(DIST_DIR)/$(CPP_FILENAME)$(CPP_FILE_EXTENSION)



# compiler variables
# -Wl,-rpath,. embeds into the binary the libraries search path=. while -Ldir tell the linker where to search to resolve symbols
ifeq ($(CPP_LIBRARIES_RUNTIME_PATH),)
  CPP_LIBRARIES_RUNTIME_PATH=.
endif
LDFLAGS=-Wl,-rpath,$(CPP_LIBRARIES_RUNTIME_PATH) -L$(DIST_DIR)



################################################################################
### TARGETS
################################################################################

clean:
	rm -fr "$(BUILD_DIR)"
	rm -f "$(PROJECT_OUTPUT_FILENAME)"

build: build_dirs $(OBJECT_DIRS) $(OBJECT_FILES)
	$(CXX) $(CXXFLAGS) $(CPPFLAGS) -o "$(PROJECT_OUTPUT_FILENAME)" $(OBJECT_FILES) $(LDFLAGS) $(CPP_LIBRARIES_LINK) $(CPP_OUTPUT_TYPE) $(TARGET_ARCH)
ifneq ($(CPP_FILES_DIST),)
	cp $(CPP_FILES_DIST) "$(DIST_DIR)"
endif

build_dirs:
	mkdir -p "$(BUILD_DIR)"
	mkdir -p "$(DIST_DIR)"

$(OBJECT_DIRS):
	mkdir -p "$@"

$(OBJECT_FILES_CXX): $(BUILD_DIR)/%.o: $(SOURCE_DIR)/%
	rm -f "$@.d"
	$(CXX) $(CXXFLAGS) $(CPPFLAGS) $(TARGET_ARCH) -c $(CPP_INCLUDES) -MMD -MF "$@.d" -o "$@" "$<"

$(OBJECT_FILES_C): $(BUILD_DIR)/%.o: $(SOURCE_DIR)/%
	rm -f "$@.d"
	$(CC) $(CFLAGS) $(CPPFLAGS) $(TARGET_ARCH) -c $(CPP_INCLUDES) -MMD -MF "$@.d" -o "$@" "$<"

ifneq ($(DEPENDANCY_FILES),)
include $(DEPENDANCY_FILES)
endif
