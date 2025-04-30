#ifndef SUNAPTOS_H
#define	SUNAPTOS_H

// STANDARD LIBRARY INCLUDES
#include <cstdlib>
#include <cstdio>
#include <cstring>
#include <string>
#include <sstream>
#include <map>
#include <set>
#include <iostream>
//using namespace std;

// SUNAPTOS INCLUDES
#include "dlib.h"

#include "debug.h"

// system
#include "lock.h"
#include "thread.h"
#include "sharedmemory.h"
#include "dynamiclibraryloader.h"

// globals
#include "singleton.h"
#include "singletons.h"
#include "functions.h"
#include "dynamiclibrarymanager.h"

// base
#include "buffer.h"
#include "object.h"
#include "sequence.h"
#include "exception.h"
#include "kernel.h"
#include "service.h"
#include "serviceclient.h"
#include "serviceserver.h"

// stream
#include "streaminput.h"
#include "streamoutput.h"
#include "stream.h"
#include "streamable.h"
#include "fileinputstream.h"
#include "fileoutputstream.h"
#include "sharedmemorystream.h"

#endif	/* SUNAPTOS_H */
