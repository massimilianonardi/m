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
#INCLUDES=-I../dir1 -I../dir2 -I../dir3
#LINKER_LIBRARIES=-L$(EXTERN_LIBRARIES_SEARCH_DIR) -Ldir1 -Ldir2 -Ldir3 -lLib1 -dynamic -lLib2 -dynamic -lLib3 -dynamic
#LINK_AS_SHARED_LIBRARY=-shared

OUTPUT_FILE_EXTENSION=.
INCLUDES=-I../src/core
LINKER_LIBRARIES=-lcore -dynamic -static-libgcc -static-libstdc++
LINK_AS_SHARED_LIBRARY=-shared

# project specific options
#PROJECT_01_OUTPUT_FILE_EXTENSION=
#PROJECT_01_INCLUDES=-I../dir1 -I../dir2 -I../dir3
#PROJECT_01_LINKER_LIBRARIES=-L$(EXTERN_LIBRARIES_SEARCH_DIR) -Ldir1 -Ldir2 -Ldir3 -lLib1 -dynamic -lLib2 -dynamic -lLib3 -dynamic
#PROJECT_01_LINK_AS_SHARED_LIBRARY=-shared

core_OUTPUT_FILE_EXTENSION=.dll
core_INCLUDES=
#core_LINKER_LIBRARIES=-static-libgcc -static-libstdc++
core_LINKER_LIBRARIES=-static
core_LINK_AS_SHARED_LIBRARY=-shared

process_OUTPUT_FILE_EXTENSION=.exe
process_LINK_AS_SHARED_LIBRARY=

test_OUTPUT_FILE_EXTENSION=.exe
test_LINK_AS_SHARED_LIBRARY=
