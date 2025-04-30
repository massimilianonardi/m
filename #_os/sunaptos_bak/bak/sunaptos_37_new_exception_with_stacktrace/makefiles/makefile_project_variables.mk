################################################################################
### GLOBAL VARIABLES
################################################################################

PROJECTS_HI_PRI=_system _stream _service _core
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
INCLUDES=-I../src/_core -I../src/_service -I../src/_stream -I../src/_system
LINKER_LIBRARIES=-l_system -dynamic -l_stream -dynamic -l_service -dynamic -l_core -dynamic -static-libgcc -static-libstdc++
LINK_AS_SHARED_LIBRARY=-shared

# project specific options
#PROJECT_01_OUTPUT_FILE_EXTENSION=
#PROJECT_01_INCLUDES=-I../dir1 -I../dir2 -I../dir3
#PROJECT_01_LINKER_LIBRARIES=-L$(EXTERN_LIBRARIES_SEARCH_DIR) -Ldir1 -Ldir2 -Ldir3 -lLib1 -dynamic -lLib2 -dynamic -lLib3 -dynamic
#PROJECT_01_LINK_AS_SHARED_LIBRARY=-shared

_system_OUTPUT_FILE_EXTENSION=.dll
_system_LINKER_LIBRARIES=-static
_system_LINK_AS_SHARED_LIBRARY=-shared

_stream_OUTPUT_FILE_EXTENSION=.dll
_stream_LINKER_LIBRARIES=-l_system -dynamic -static-libgcc -static-libstdc++
_stream_LINK_AS_SHARED_LIBRARY=-shared

_service_OUTPUT_FILE_EXTENSION=.dll
_service_LINKER_LIBRARIES=-l_system -dynamic -l_stream -dynamic -static-libgcc -static-libstdc++
_service_LINK_AS_SHARED_LIBRARY=-shared

_core_OUTPUT_FILE_EXTENSION=.dll
_core_LINKER_LIBRARIES=-l_system -dynamic -l_stream -dynamic -l_service -dynamic -static-libgcc -static-libstdc++
_core_LINK_AS_SHARED_LIBRARY=-shared

process_OUTPUT_FILE_EXTENSION=.exe
process_LINK_AS_SHARED_LIBRARY=

test_OUTPUT_FILE_EXTENSION=.exe
test_LINK_AS_SHARED_LIBRARY=
