#include "sunaptos.h"

#include <string>

#define COMMAND_LINE_EXE argv[0]
#define COMMAND_LINE_SRV argv[1]

int main(int argc, char** argv)
{
  exception_try
  // process command line
  Sequence params;
  if(2 < argc) params.from_text(std::string(argv[2]).c_str());
  debug(params.text())

  // instantiate the service with keeping alive feature
  service_shared_pointer ssp = load(COMMAND_LINE_SRV, params);
//  load(COMMAND_LINE_SRV, params);
  debug("[Process 98] [WAITING EXIT]")
  loader.wait_unlock(empty_sequence);
  
  // exit
  exception_catch_print
  exception_end

  debug("[Process 99] [EXIT]")
  return 0;
}
