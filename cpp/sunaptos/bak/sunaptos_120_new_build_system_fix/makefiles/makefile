# OPTIONAL INPUT VARIABLES: SOURCE_DIR, PROJECTS_HI_PRI, PROJECTS_LO_PRI, PROJECTS_LIST

.PHONY: all clean build
.DEFAULT_GOAL:=all

include defaults_directories.conf
include makefile.conf

# projects list
ifneq ($(PROJECTS_LIST),)
  PROJECTS=$(PROJECTS_LIST)
else
  PROJECTS=$(PROJECTS_HI_PRI) $(filter-out $(PROJECTS_HI_PRI) $(PROJECTS_LO_PRI), $(shell cd $(SOURCE_DIR); find . -mindepth 1 -maxdepth 1 -type d | sed 's|^\./||g')) $(PROJECTS_LO_PRI)
endif



################################################################################
### TARGETS
################################################################################

all: clean build

clean:
	$(info --------------------------------------------------------------------------------)
	$(info --- SCOPE: workspace --- COMMAND: clean)
	$(info --------------------------------------------------------------------------------)
	$(RM) -r $(BUILD_DIR)
	$(RM) -r $(DIST_DIR)

build: $(PROJECTS)

$(PROJECTS):
	$(info --------------------------------------------------------------------------------)
	$(info --- SCOPE: workspace --- COMMAND: build --- PROJECT: $@)
	$(info --------------------------------------------------------------------------------)
	$(MAKE) -f makefile_project build PROJECT=$@
