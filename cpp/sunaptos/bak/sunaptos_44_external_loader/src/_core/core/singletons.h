#ifndef _SINGLETONS_H
#define	_SINGLETONS_H

#include "singleton.h"
#include "lock.h"
#include "dynamiclibrarymanager.h"
#include "loader.h"

typedef Singleton<Lock> prclck;
typedef Singleton<DynamicLibraryManager> dlm;
typedef Singleton<Loader> ldr;

#endif	// _SINGLETONS_H
