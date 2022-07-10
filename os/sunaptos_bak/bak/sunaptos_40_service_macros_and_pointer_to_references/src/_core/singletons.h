#ifndef _SINGLETONS_H
#define	_SINGLETONS_H

#include "singleton.h"
#include "lock.h"
#include "dynamiclibrarymanager.h"

typedef Singleton<Lock> prclck;
typedef Singleton<DynamicLibraryManager> dlm;

#endif	// _SINGLETONS_H
