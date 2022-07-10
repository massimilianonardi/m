#include "thread.h"

#ifdef WIN32
#include <windows.h>
#elif defined LINUX
#include <pthread.h>
#else
#endif

#ifdef WIN32
unsigned long threadproc(void* c)
#elif defined LINUX
void* threadproc(void* c)
#else
#endif
{
  Thread* th = static_cast<Thread*>(c);
  th->run();
  return 0;
}

Thread::Thread(): active(true)
{
}

Thread::~Thread()
{
#ifdef WIN32
  CloseHandle(h);
#elif defined LINUX
  pthread_exit(&h);
#else
#endif
}

void Thread::start()
{
#ifdef WIN32
  h = CreateThread(0, 0, (unsigned long (__stdcall*)(void*)) threadproc, (void*) this, 0, 0);
#elif defined LINUX
  pthread_create(&h, 0, threadproc, (void*) this);
#else
#endif
}

void Thread::stop()
{
  active = false;
}

void Thread::run()
{
  while(active)
  {
    runloop();
  }
}
