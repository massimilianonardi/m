################################################################################
### GLOBAL VARIABLES
################################################################################

CPPFLAGS+=
CFLAGS+=
CXXFLAGS+=-std=c++11 -fvisibility=hidden
LDFLAGS+=

CPPFLAGS_DEBUG=
CFLAGS_DEBUG=
CXXFLAGS_DEBUG=
#CXXFLAGS_DEBUG=-fpermissive
LDFLAGS_DEBUG=

CPPFLAGS_RELEASE=
CFLAGS_RELEASE=
CXXFLAGS_RELEASE=
LDFLAGS_RELEASE=-Wl,--strip-debug

PROJECTS_HI_PRI=_core _loader
PROJECTS_LO_PRI=

ifeq ($(TARGET_OS), WIN)
  ifeq ($(TARGET_ARCHITECTURE), 64)
    CPPFLAGS+=-DWIN32
  endif
endif



################################################################################
### PROJECT VARIABLES
################################################################################

# defaults
#OUTPUT_FILE_EXTENSION=. ### if empty, uses target system defaults (executable, shared or static library), if set to a dot '.', then no file extension will be used
#INCLUDES=-I../dir1 -I../dir2 -I../dir3 $(addprefix -I, $(shell find ../src/dir4 -mindepth 0 -type d)) ### detect dir4 subdirectories
#LINKER_LIBRARIES=-L$(EXTERN_LIBRARIES_SEARCH_DIR) -Ldir1 -Ldir2 -Ldir3 -lLib1 -dynamic -lLib2 -dynamic -lLib3 -dynamic
#LINK_AS_SHARED_LIBRARY=-shared

OUTPUT_FILE_EXTENSION=.
INCLUDES=$(addprefix -I, $(shell find ../src/_core -mindepth 0 -type d))
#LINKER_LIBRARIES=-l_core -dynamic -static-libgcc -static-libstdc++
LINKER_LIBRARIES=-l_core -dynamic
LINK_AS_SHARED_LIBRARY=-shared

# project specific options
#PROJECT_01_OUTPUT_FILE_EXTENSION=
#PROJECT_01_INCLUDES=-I../dir1 -I../dir2 -I../dir3
#PROJECT_01_LINKER_LIBRARIES=-L$(EXTERN_LIBRARIES_SEARCH_DIR) -Ldir1 -Ldir2 -Ldir3 -lLib1 -dynamic -lLib2 -dynamic -lLib3 -dynamic
#PROJECT_01_LINK_AS_SHARED_LIBRARY=-shared

_core_OUTPUT_FILE_EXTENSION=.dll
_core_LINKER_LIBRARIES=-static
_core_LINK_AS_SHARED_LIBRARY=-shared

process_OUTPUT_FILE_EXTENSION=
process_LINK_AS_SHARED_LIBRARY=

test_OUTPUT_FILE_EXTENSION=
test_INCLUDES=
test_LINK_AS_SHARED_LIBRARY=

_loader_OUTPUT_FILE_EXTENSION=.dll
_loader_LINK_AS_SHARED_LIBRARY=-shared

#_sdl_OUTPUT_FILE_EXTENSION=.dll
#_sdl_LINK_AS_SHARED_LIBRARY=-shared
_sdl_OUTPUT_FILE_EXTENSION=
#_sdl_INCLUDES=$(addprefix -I, $(shell find ../src/_sdl -mindepth 0 -type d))
#_sdl_LINKER_LIBRARIES=-L$(addprefix -I, $(shell find ../src/_sdl -mindepth 0 -type d)) -lSDL2main -lSDL2 -dynamic
_sdl_INCLUDES=-I../src/_sdl/$(TARGET_OS)_$(TARGET_ARCHITECTURE)/include/SDL2
#_sdl_LINKER_LIBRARIES=$(shell pkg-config --libs sdl2)
#_sdl_LINKER_LIBRARIES=-L../src/_sdl/$(TARGET_OS)_$(TARGET_ARCHITECTURE)/lib -lSDL2main -lSDL2
_sdl_LINKER_LIBRARIES=-L../src/_sdl/$(TARGET_OS)_$(TARGET_ARCHITECTURE)/lib -static -lmingw32 -lSDL2main -lSDL2  -mwindows  -Wl,--no-undefined -lm -ldinput8 -ldxguid -ldxerr8 -luser32 -lgdi32 -lwinmm -limm32 -lole32 -loleaut32 -lshell32 -lversion -luuid -static-libgcc
_sdl_LINK_AS_SHARED_LIBRARY=

Loader_INCLUDES:=$(INCLUDES) -I../src/_loader
Loader_LINKER_LIBRARIES:=$(LINKER_LIBRARIES) -l_loader -dynamic

LoaderLocal_INCLUDES:=$(INCLUDES) -I../src/_loader
LoaderLocal_LINKER_LIBRARIES:=$(LINKER_LIBRARIES) -l_loader -dynamic

LoaderAdvanced_INCLUDES:=$(INCLUDES) -I../src/_loader
LoaderAdvanced_LINKER_LIBRARIES:=$(LINKER_LIBRARIES) -l_loader -dynamic

LoaderServer_INCLUDES:=$(INCLUDES) -I../src/_loader
LoaderServer_LINKER_LIBRARIES:=$(LINKER_LIBRARIES) -l_loader -dynamic

ServiceStreamer_INCLUDES:=$(INCLUDES) -I../src/_loader
ServiceStreamer_LINKER_LIBRARIES:=$(LINKER_LIBRARIES) -l_loader -dynamic

gui_INCLUDES:=$(INCLUDES) -I../src/_loader
gui_LINKER_LIBRARIES:=$(LINKER_LIBRARIES) -l_loader -dynamic
