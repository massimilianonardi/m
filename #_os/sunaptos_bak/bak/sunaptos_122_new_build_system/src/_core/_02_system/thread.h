#ifndef _THREAD_H
#define	_THREAD_H

#ifdef WIN32
#include <windows.h>
#elif defined LINUX
#include <pthread.h>
#else
#endif

class thread
{
public:
  thread();
  virtual ~thread();

  virtual void start();
  virtual void stop();
  virtual void run();
  virtual bool is_running();
  virtual void runloop() = 0;

protected:
  thread(const thread& orig) = delete;
  thread& operator=(const thread& orig) = delete;
  bool active;
  bool running;
#ifdef WIN32
  HANDLE h;
#elif defined LINUX
  pthread_t h;
#else
#endif
};

#endif	// _THREAD_H
