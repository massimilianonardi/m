#include "sunaptos.h"

int main(int argc, char** argv)
{
  exception_try
  debug("[Process 00]")
  Sequence params;

  for(int i = 0; i < argc; i++)
  {
    debug("[Process 00] argument index: " << i << " - argument value: " << argv[i])
    params << argv[i];
  }

  Kernel* k = new Kernel(params);

  // wait until exit request
  debug("[Process 01] [WAITING TERMINATE]")
  prclck::i().lock();
  prclck::i().waitunlock();

  // cleanup sequence
  delete k;
  debug("[Process 02] [TERMINATION SUCCESSFUL]")
  exception_catch_print
  exception_end

  debug("[Process 99] [EXIT]")
  return 0;
}
