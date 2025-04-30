#include "sunaptos.h"
#include "exception.h"
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
    Sequence seq = "test";
    seq << 5;
    if(seq == Sequence("test") << 5) debug("OK")
    else debug("ERROR")
    seq = 2;
    seq << "asd>;asd\\>:asd";
    seq << 5.4;
    seq.from_text("$:t:<asdqwe>:[$:t:<asd>;]:[$:t:<qwe>;]:[$:i:<123>;]:[$:f:<5.6>;];");
    debug(seq.to_text())
    debug(((Sequence) 9 << "test" << 8.6).text())
//    throw std::exception();
//    throw 0;
    exception_throw
    exception_catch
//    exception_rethrow_end
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
