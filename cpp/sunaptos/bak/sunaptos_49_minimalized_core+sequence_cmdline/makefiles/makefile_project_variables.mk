################################################################################
### GLOBAL VARIABLES
################################################################################

PROJECTS_HI_PRI=_core _loader
PROJECTS_LO_PRI=



################################################################################
### PROJECT VARIABLES
################################################################################

# defaults
#OUTPUT_FILE_EXTENSION=.dll
#INCLUDES=-I../dir1 -I../dir2 -I../dir3
#LINKER_LIBRARIES=-L$(EXTERN_LIBRARIES_SEARCH_DIR) -Ldir1 -Ldir2 -Ldir3 -lLib1 -dynamic -lLib2 -dynamic -lLib3 -dynamic
#LINK_AS_SHARED_LIBRARY=-shared

OUTPUT_FILE_EXTENSION=.
INCLUDES=$(addprefix -I, $(shell find ../src/_core -mindepth 0 -type d))
LINKER_LIBRARIES=-l_core -dynamic -static-libgcc -static-libstdc++
LINK_AS_SHARED_LIBRARY=-shared

# project specific options
#PROJECT_01_OUTPUT_FILE_EXTENSION=
#PROJECT_01_INCLUDES=-I../dir1 -I../dir2 -I../dir3
#PROJECT_01_LINKER_LIBRARIES=-L$(EXTERN_LIBRARIES_SEARCH_DIR) -Ldir1 -Ldir2 -Ldir3 -lLib1 -dynamic -lLib2 -dynamic -lLib3 -dynamic
#PROJECT_01_LINK_AS_SHARED_LIBRARY=-shared

_core_OUTPUT_FILE_EXTENSION=.dll
_core_LINKER_LIBRARIES=-static
_core_LINK_AS_SHARED_LIBRARY=-shared

process_OUTPUT_FILE_EXTENSION=.exe
process_LINK_AS_SHARED_LIBRARY=

test_OUTPUT_FILE_EXTENSION=.exe
test_LINK_AS_SHARED_LIBRARY=

_loader_OUTPUT_FILE_EXTENSION=.dll
_loader_LINK_AS_SHARED_LIBRARY=-shared

Loader_INCLUDES:=$(INCLUDES) -I../src/_loader
Loader_LINKER_LIBRARIES:=$(LINKER_LIBRARIES) -l_loader -dynamic

LoaderAdvanced_INCLUDES:=$(INCLUDES) -I../src/_loader
LoaderAdvanced_LINKER_LIBRARIES:=$(LINKER_LIBRARIES) -l_loader -dynamic

LoaderServer_INCLUDES:=$(INCLUDES) -I../src/_loader
LoaderServer_LINKER_LIBRARIES:=$(LINKER_LIBRARIES) -l_loader -dynamic

gui_INCLUDES:=$(INCLUDES) -I../src/_loader
gui_LINKER_LIBRARIES:=$(LINKER_LIBRARIES) -l_loader -dynamic
