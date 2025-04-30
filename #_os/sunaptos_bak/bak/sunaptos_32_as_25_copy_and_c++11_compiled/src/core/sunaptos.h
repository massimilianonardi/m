#ifndef SUNAPTOS_H
#define	SUNAPTOS_H

// STANDARD LIBRARY INCLUDES
#include <cstdlib>
#include <cstdio>
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

#include "number.h"
#include "object.h"

#include "singleton.h"

#include "buffer.h"
#include "streaminput.h"
#include "streamoutput.h"
#include "stream.h"
#include "streamable.h"
#include "sequence.h"
#include "fileinputstream.h"
#include "fileoutputstream.h"

#include "service.h"

#include "debug.h"
#include "exception.h"

#include "sharedmemory.h"
#include "sharedmemorystream.h"
#include "serviceclient.h"
#include "thread.h"
#include "serviceserver.h"

#include "dynamiclibraryloader.h"
#include "dynamiclibrarymanager.h"

#include "kernel.h"
#include "lock.h"
#include "singletons.h"

#include "functions.h"

#endif	/* SUNAPTOS_H */
