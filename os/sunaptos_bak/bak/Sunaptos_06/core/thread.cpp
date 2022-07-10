#include "thread.h"

#ifdef WIN32
#include <windows.h>

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

Thread::Thread()
{
}

Thread::~Thread()
{
}

void Thread::start()
{
#ifdef WIN32
  CreateThread(0, 0, (unsigned long (__stdcall*)(void*)) threadproc, (void*) this, 0, 0);
#elif defined LINUX
  // todo: linux code
#else
#endif
}
