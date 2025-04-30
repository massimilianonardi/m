#include "sunaptos.h"

int main(int argc, char** argv)
{
  try
  {
    debug("[Process 00] " << argv[0] << " " << argv[1] << " " << argv[2] << " " << argv[3] << " " << argv[4] << " " << argv[5])
    Sequence params;
    params << argv[1];
    params << new Sequence();
    params(1) << atoi(argv[2]) << argv[3];
    params << new Sequence();
    params(2) << atoi(argv[4]) << argv[5];

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
