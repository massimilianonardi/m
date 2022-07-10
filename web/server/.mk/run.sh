#!/bin/sh

#"$ROOT_DIR/pkg/m-web-server/bin/mnode" start m-lib-java
"$ROOT_DIR/pkg/m-web-server/bin/mnode" startnolog m-lib-java
slp
"$ROOT_DIR/pkg/m-web-server/bin/mnode" stop