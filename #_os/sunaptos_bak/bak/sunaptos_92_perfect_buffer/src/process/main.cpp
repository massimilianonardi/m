#include "sunaptos.h"

#include <string>

#define COMMAND_LINE_EXE argv[0]
#define COMMAND_LINE_SRV argv[1]

int main(int argc, char** argv)
{
  exception_try
  // process command line
  sequence params;
  debug("[Process 00] argument index: " << 1 << " - argument value: " << argv[1])
  for(int i = 2; i < argc; i++)
  {
    debug("[Process 00] argument index: " << i << " - argument value: " << argv[i])
    params.links_ins(argv[i]);
  }
//  if(2 < argc) params.from_text(std::string(argv[2]).c_str());
  debug(params.to_string())

  // instantiate the service with keeping alive feature
  sequence s(COMMAND_LINE_SRV, params);
  debug("[Process 98] [WAITING EXIT]")
  loader.wait_unlock(sequence());
  
  // exit
  exception_catch
  exception_print_stack_trace
  exception_end

  debug("[Process 99] [EXIT]")
  return 0;
}
