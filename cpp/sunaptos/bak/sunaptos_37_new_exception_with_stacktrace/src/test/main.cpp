#include "sunaptos.h"
#include "exception.h"
#include "../_stream/exception.h"
#include <iostream>

int main(int argc, char** argv)
{
  try
  {
//    debug("[Process 00]")
    
    exception_try
    exception_checkpoint
    exception_checkpoint
    exception_checkpoint
//    throw std::exception();
//    throw 0;
    exception_throw
    exception_catch
//    exception_print_stack_trace(std::cout)
//    exception_print_stack_trace(std::cerr)
    exception_print_stack_trace_standard_error
//    exception_rethrow
    exception_end
    
//    debug("[Process 90] [TERMINATION SUCCESSFUL]")
  }
  catch(const char* msg)
  {
    printf(msg);
    getchar();
  }
  catch(...)
  {
//    debug("[Process 00] [Undefined Exception!]")
    getchar();
  }

//  debug("[Process 99] [EXIT]")
  return 0;
}
