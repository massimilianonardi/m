#include "sunaptos.h"

#ifdef WIN32
unsigned long threadproc(void* c)
{
  Thread* th = static_cast<Thread*>(c);
  th->run();
  return 0;
}
#elif defined LINUX
  // todo: linux thread
#else
#endif

Thread::Thread(): active(true)
{
}

Thread::~Thread()
{
#ifdef WIN32
  CloseHandle(h);
#elif defined LINUX
  // todo: linux code
#else
#endif
}

void Thread::start()
{
#ifdef WIN32
  h = CreateThread(0, 0, (unsigned long (__stdcall*)(void*)) threadproc, (void*) this, 0, 0);
#elif defined LINUX
  // todo: linux code
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
