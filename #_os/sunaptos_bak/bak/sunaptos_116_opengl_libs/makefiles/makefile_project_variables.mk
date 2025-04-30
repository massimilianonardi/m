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
#LDFLAGS_DEBUG=-Wl,--verbose

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

#OPENGL_INCLUDES:=-I../lib/glm-0.9.7.1 -I../lib/glfw-3.1.1/include -I../lib/glfw-3.1.1/include/GLFW -DGLEW_STATIC -I../lib/glew-1.13.0/include -I../lib/glew-1.13.0/include/GL
#OPENGL_LIBRARIES_LINK:=-L../lib/glfw-3.1.1/$(TARGET_OS)$(TARGET_ARCHITECTURE) -lglfw3 -static -lopengl32 -lglu32 -lglaux -lgdi32 -dynamic
#OPENGL_INCLUDES:=-I../lib/glm-0.9.7.1 -I../lib/glfw-3.1.1/include -I../lib/glfw-3.1.1/include/GLFW -I../lib/glew-1.13.0/include -I../lib/glew-1.13.0/include/GL
#OPENGL_LIBRARIES_LINK:=-L../lib/glfw-3.1.1/$(TARGET_OS)$(TARGET_ARCHITECTURE) -lglfw3 -static -L../lib/glew-1.13.0/bin/Release/Win32 -l:glew32.dll -lopengl32 -lglu32 -lglaux -lgdi32 -dynamic
OPENGL_INCLUDES:=-I../lib/glm-0.9.7.1 -I../lib/glfw-3.1.1/include -I../lib/glfw-3.1.1/include/GLFW -DGLEW_STATIC -I../lib/glew-1.13.0/include -I../lib/glew-1.13.0/include/GL
OPENGL_LIBRARIES_LINK:=-L../lib/glfw-3.1.1/$(TARGET_OS)$(TARGET_ARCHITECTURE) -lglfw3 -L../lib/glew-1.13.0/lib/Release/$(TARGET_OS)$(TARGET_ARCHITECTURE) -lglew32s -static -lopengl32 -lglu32 -lglaux -lgdi32 -dynamic



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
#test_INCLUDES=
test_INCLUDES=$(addprefix -I, $(shell find ../src/test -mindepth 0 -type d)) $(OPENGL_INCLUDES)
test_LINK_AS_SHARED_LIBRARY=
test_LINKER_LIBRARIES:=$(OPENGL_LIBRARIES_LINK)

_loader_OUTPUT_FILE_EXTENSION=.dll

Loader_INCLUDES:=$(INCLUDES) -I../src/_loader
Loader_LINKER_LIBRARIES:=$(LINKER_LIBRARIES) -l_loader -dynamic

input_hid_INCLUDES:=$(INCLUDES) -I../src/input

output_manager_window_LINKER_LIBRARIES:=$(LINKER_LIBRARIES) -lGdi32 -dynamic

output_manager_opengl_INCLUDES:=$(INCLUDES) $(OPENGL_INCLUDES)
#output_manager_opengl_LINKER_LIBRARIES:=$(LINKER_LIBRARIES) $(OPENGL_LIBRARIES_LINK)
output_manager_opengl_LINKER_LIBRARIES:=-l:_core.dll -dynamic $(OPENGL_LIBRARIES_LINK)
