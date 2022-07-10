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
using namespace std;

// PLATFORM DEPENDENT INCLUDES
#ifdef linux
#define LINUX
#endif

#ifdef WIN32
#include <windows.h>
#elif defined LINUX
#include <stdio.h>
#include <memory.h>
#include <dlfcn.h>
#include <sys/time.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <unistd.h>
#include <pthread.h>
#else
#endif

// SUNAPTOS INCLUDES
//#include "dlib.h"

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
#include "number.h"
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
