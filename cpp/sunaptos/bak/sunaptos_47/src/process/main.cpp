#include "sunaptos.h"

#define COMMAND_LINE_EXE argv[0]
#define COMMAND_LINE_SRV argv[1]

int main(int argc, char** argv)
{
  exception_try
  debug("[Process 00]")

  // build srv params from command line
  // TODO: use the Sequence.from_text feature!
  Sequence params;
  debug("[Process 00] argument index: " << 1 << " - argument value: " << argv[1])
  for(int i = 2; i < argc; i++)
  {
    debug("[Process 00] argument index: " << i << " - argument value: " << argv[i])
    params << argv[i];
  }

  process_lock();
//  service_shared_pointer ssp = load(COMMAND_LINE_SRV, params);
  load(COMMAND_LINE_SRV, params);
  debug("[Process 98] [WAITING EXIT]")
  process_waitunlock();
  exception_catch_print
  exception_end

  debug("[Process 99] [EXIT]")
  return 0;
}
