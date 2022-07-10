#ifndef SUNAPTOS_H
#define	SUNAPTOS_H

// STANDARD LIBRARY INCLUDES
#include <string>
#include <sstream>
#include <map>
#include <set>
#include <iostream>
using namespace std;

// PLATFORM DEPENDENT INCLUDES
#ifdef WIN32
#include <windows.h>
#elif defined LINUX
// todo: linux includes
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
