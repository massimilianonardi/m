#include "sunaptos.h"

int main(int argc, char** argv)
{
  try
  {
    debug("[Process 00]")
    sequence params;
    
    for(int i = 0; i < argc; i++)
    {
      debug("[Process 00] argument index: " << i << " - argument value: " << argv[i])
      params << argv[i];
//      params << new sequence(argv[i]);
//      debug("[Process 00] argument index: " << i << " - argument loaded value: " << params[i].seq)
    }
    debug("[Process 00] params: " << params.text())

    Kernel* k = new Kernel(params);

    // wait until exit request
    debug("[Process 01] [WAITING TERMINATE]")
    prclck::i().lock();
    prclck::i().waitunlock();

    // cleanup sequence
    delete k;
    debug("[Process 02] [TERMINATION SUCCESSFUL]")
  }
  catch(const char* msg)
  {
    printf(msg);
    getchar();
  }
  catch(...)
  {
    debug("[Process 00] [Undefined Exception!]")
    getchar();
  }

  debug("[Process 99] [EXIT]")
  return 0;
}
