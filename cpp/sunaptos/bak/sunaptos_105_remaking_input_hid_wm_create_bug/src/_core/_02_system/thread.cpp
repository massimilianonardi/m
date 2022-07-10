#include "thread.h"

#ifdef WIN32
#include <windows.h>
#elif defined LINUX
#include <pthread.h>
#else
#endif

#include "exception.h"

#ifdef WIN32
unsigned long threadproc(void* c)
#elif defined LINUX
void* threadproc(void* c)
#else
#endif
{
  thread* th = static_cast<thread*>(c);
  th->run();
  return 0;
}

thread::thread(): active(true), running(true)
{
}

thread::~thread()
{
#ifdef WIN32
  CloseHandle(h);
#elif defined LINUX
  pthread_exit(&h);
#else
#endif
}

void thread::start()
{
#ifdef WIN32
  h = CreateThread(0, 0, (unsigned long (__stdcall*)(void*)) threadproc, (void*) this, 0, 0);
  if(h == 0) exception_throw_type(exception_type::creation_failed)
#elif defined LINUX
  int res = pthread_create(&h, 0, threadproc, (void*) this);
  if(res != 0) exception_throw_type(exception_type::creation_failed)
#else
#endif
}

void thread::stop()
{
  active = false;
}

void thread::run()
{
  while(active)
  {
    runloop();
  }
  running = false;
}

bool thread::is_running()
{
  return running;
}
