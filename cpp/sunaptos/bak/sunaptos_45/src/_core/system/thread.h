#ifndef _THREAD_H
#define	_THREAD_H

#ifdef WIN32
#include <windows.h>
#elif defined LINUX
#include <pthread.h>
#else
#endif

class Thread
{
protected:
  bool active;
#ifdef WIN32
  HANDLE h;
#elif defined LINUX
  pthread_t h;
#else
#endif

public:
  Thread();
  virtual ~Thread();

  virtual void start();
  virtual void stop();
  virtual void run();
  virtual void runloop() = 0;
};

#endif	// _THREAD_H
