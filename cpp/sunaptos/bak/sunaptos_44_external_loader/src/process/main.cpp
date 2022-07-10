#include "sunaptos.h"

#define COMMAND_LINE_EXE argv[0]
#define COMMAND_LINE_SRV argv[1]

int main(int argc, char** argv)
{
  exception_try
  debug("[Process 00]")

  // build srv params from command line
  Sequence params;
  debug("[Process 00] argument index: " << 1 << " - argument value: " << argv[1])
  for(int i = 2; i < argc; i++)
  {
    debug("[Process 00] argument index: " << i << " - argument value: " << argv[i])
    params << argv[i];
  }

  ldr::i().create(COMMAND_LINE_SRV, params);

  // wait until exit request
  debug("[Process 01] [WAITING TERMINATE]")
  prclck::i().lock();
  prclck::i().waitunlock();

  // cleanup sequence
  debug("[Process 02] [TERMINATION SUCCESSFUL]")
  exception_catch_print
  exception_end

  debug("[Process 99] [EXIT]")
  return 0;
}
