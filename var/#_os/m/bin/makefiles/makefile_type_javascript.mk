################################################################################
### INCLUDE
################################################################################

#MAKEFILE_DIR:=$(shell dirname "$(strip $(MAKEFILE_LIST))" | sed 's/ /\\ /g')
#include $(MAKEFILE_DIR)/makefile.conf
.PHONY: clean depend dependclean build



################################################################################
### JAVASCRIPT
################################################################################



# build environment
JJS=jjs -scripting
JSMAKE=$(MAKEFILE_DIR)/makefile_type_javascript.js
#GJSCOMPILER=$(SCRIPT_DIR)/lib/google-js-compiler/compiler.jar
#YUICOMPRESSOR=$(SCRIPT_DIR)/lib/yuicompressor/yuicompressor.jar
#GJSCOMPILER=$(BIN_DIR)/google-js-compiler/compiler.jar
#YUICOMPRESSOR=$(BIN_DIR)/yuicompressor/yuicompressor.jar
ifeq ($(OS),Windows_NT)
  JSMAKE:=$(shell cygpath -w $(JSMAKE))
  ifneq ($(wildcard $(GJSCOMPILER)),)
    GJSCOMPILER:=$(shell cygpath -w $(GJSCOMPILER))
  else
    GJSCOMPILER:=
  endif
  ifneq ($(wildcard $(YUICOMPRESSOR)),)
    YUICOMPRESSOR:=$(shell cygpath -w $(YUICOMPRESSOR))
  else
    YUICOMPRESSOR:=
  endif
endif
JSMIN=java -jar "$(GJSCOMPILER)"
MINIFY=java -jar "$(YUICOMPRESSOR)"
GZIP=gzip

# build variables
#DIST_DIR:=$(DIST_DIR)/$(PROJECT)

PROJECT_OUTPUT_FILENAME=$(DIST_DIR)/$(PROJECT)

ifeq ($(SYS_OS_TYPE),windows)
  JSMAKE:=$(shell cygpath -w "$(JSMAKE)")
  SOURCE_DIR:=$(shell cygpath -w "$(SOURCE_DIR)")
  ifneq ($(JAVASCRIPT_JS_CONF_FILE),)
    JAVASCRIPT_JS_CONF_FILE:=$(shell cygpath -w "$(JAVASCRIPT_JS_CONF_FILE)")
  endif
  ifneq ($(JAVASCRIPT_CSS_CONF_FILE),)
    JAVASCRIPT_CSS_CONF_FILE:=$(shell cygpath -w "$(JAVASCRIPT_CSS_CONF_FILE)")
  endif
endif



################################################################################
### TARGETS
################################################################################

depend:
	$(info goal: $@)

dependclean:
	$(info goal: $@)

clean:
	$(info goal: $@)
	rm -fr "$(BUILD_DIR)"
ifeq ($(SHARED_DIST),)
	rm -f "$(PROJECT_OUTPUT_FILENAME)".*
else
	rm -f "$(DIST_DIR)"
endif

build:
	$(info goal: $@)
	mkdir -p "$(BUILD_DIR)"
	mkdir -p "$(DIST_DIR)"
ifneq ($(JAVASCRIPT_LIBRARIES_DIST),)
	find $(JAVASCRIPT_LIBRARIES_DIST) -name "*.js" -exec cat {} >> "$(PROJECT_OUTPUT_FILENAME).js" \;
	find $(JAVASCRIPT_LIBRARIES_DIST) -name "*.css" -exec cat {} >> "$(PROJECT_OUTPUT_FILENAME).css" \;
#	find $(JAVASCRIPT_LIBRARIES_DIST) -type f ! -name "*.js" ! -name "*.css" -exec $(CP) {} $(DIST_DIR) \;
	find $(JAVASCRIPT_LIBRARIES_DIST) -type f ! -name "*.js" ! -name "*.css" -printf 'o=\"%p\"; d=\"%P\"; f=\"%f\"; df=\"$${d//\"$$f\"/}\"; mkdir -p \"$(DIST_DIR)/$$df\"; cp \"$$o\" \"$(DIST_DIR)/$$df\"; \n' 2> /dev/null | xargs -I "{}" sh -c '{}'
endif
ifneq ($(JAVASCRIPT_JS_CONF_FILE),)
	cd "$(SOURCE_DIR)"; $(JJS) "$(JSMAKE)" -- "." "$(JAVASCRIPT_JS_CONF_FILE)" >> "$(PROJECT_OUTPUT_FILENAME).js"
else
	cd "$(SOURCE_DIR)"; $(JJS) "$(JSMAKE)" -- "." >> "$(PROJECT_OUTPUT_FILENAME).js"
endif
ifneq ($(JAVASCRIPT_CSS_CONF_FILE),)
	cd "$(SOURCE_DIR)"; $(JJS) "$(JSMAKE)" -- "." "$(JAVASCRIPT_CSS_CONF_FILE)" >> "$(PROJECT_OUTPUT_FILENAME).css"
else
	find "$(SOURCE_DIR)" -name "*.css" -exec cat {} >> "$(PROJECT_OUTPUT_FILENAME).css" \;
endif
ifneq ($(GJSCOMPILER),)
	$(JSMIN) --compilation_level $(JAVASCRIPT_MINIFY) --js_output_file="$(PROJECT_OUTPUT_FILENAME).min.js" "$(PROJECT_OUTPUT_FILENAME).js"
ifneq ($(JAVASCRIPT_GZIP),)
	$(GZIP) < "$(PROJECT_OUTPUT_FILENAME).min.js" > "$(PROJECT_OUTPUT_FILENAME).min.js.gz"
endif
else
ifneq ($(JAVASCRIPT_GZIP),)
	$(GZIP) < "$(PROJECT_OUTPUT_FILENAME).js" > "$(PROJECT_OUTPUT_FILENAME).js.gz"
endif
endif
ifneq ($(YUICOMPRESSOR),)
	$(MINIFY) --type css --charset utf-8 "$(PROJECT_OUTPUT_FILENAME).css" -o "$(PROJECT_OUTPUT_FILENAME).min.css"
ifneq ($(JAVASCRIPT_GZIP),)
	$(GZIP) < "$(PROJECT_OUTPUT_FILENAME).min.css" > "$(PROJECT_OUTPUT_FILENAME).min.css.gz"
endif
else
ifneq ($(JAVASCRIPT_GZIP),)
	$(GZIP) < "$(PROJECT_OUTPUT_FILENAME).css" > "$(PROJECT_OUTPUT_FILENAME).css.gz"
endif
endif
