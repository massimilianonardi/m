#ifndef SYSTEM_H
#define	SYSTEM_H

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


#endif	/* SYSTEM_H */
