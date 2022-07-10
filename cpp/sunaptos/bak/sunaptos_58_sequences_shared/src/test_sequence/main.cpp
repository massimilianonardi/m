#include "Exception.h"
#include "debug.h"
#include "Sequence.h"

// STANDARD LIBRARY INCLUDES
#include <cstdlib>
#include <cstdio>
#include <cstring>
#include <string>
#include <sstream>
#include <map>
#include <set>
#include <iostream>
#include <memory>

int main(int argc, char** argv)
{
  try
  {
    debug("[Process 00]")
    
    exception_try
    exception_checkpoint
    exception_checkpoint
    exception_checkpoint
    debug_line
//    SequenceElement s;
    Sequence s;
    debug_line
    s = (bool) true;
    debug((bool) s)
    debug((int) s)
    debug((long) s)
    debug((long long) s)
    debug((float) s)
    debug((double) s)
    debug((long double) s)
    debug((const char*) s)
    debug_line
    s = (int) 65000;
    debug((bool) s)
    debug((int) s)
    debug((long) s)
    debug((long long) s)
    debug((float) s)
    debug((double) s)
    debug((long double) s)
    debug((const char*) s)
    debug_line
    s = (long) 5;
    debug((bool) s)
    debug((int) s)
    debug((long) s)
    debug((long long) s)
    debug((float) s)
    debug((double) s)
    debug((long double) s)
    debug((const char*) s)
    debug_line
    s = (long long) 5;
    debug((bool) s)
    debug((int) s)
    debug((long) s)
    debug((long long) s)
    debug((float) s)
    debug((double) s)
    debug((long double) s)
    debug((const char*) s)
    debug_line
    s = (float) 65000.2;
    debug((bool) s)
    debug((int) s)
    debug((long) s)
    debug((long long) s)
    debug((float) s)
    debug((double) s)
    debug((long double) s)
    debug((const char*) s)
    debug_line
    s = (double) 4.2;
    debug((bool) s)
    debug((int) s)
    debug((long) s)
    debug((long long) s)
    debug((float) s)
    debug((double) s)
    debug((long double) s)
    debug((const char*) s)
    debug_line
    s = (long double) 4.2;
    debug((bool) s)
    debug((int) s)
    debug((long) s)
    debug((long long) s)
    debug((float) s)
    debug((double) s)
    debug((long double) s)
    debug((const char*) s)
    debug_line
    s = (const char*) "test";
    debug((bool) s)
    debug((int) s)
    debug((long) s)
    debug((long long) s)
    debug((float) s)
    debug((double) s)
    debug((long double) s)
    debug((const char*) s)
    debug_line
    Sequence seq = "test";
    debug_line
//    sequence_container sc;
    SequenceNodeSharedPointer snsp;
    debug_line
    snsp.resize(1);
    debug_line
    snsp[0] = 8;
    s=snsp[0];
    debug_line
    debug((long long) s)
    debug((const char*) s)
    debug_line
    snsp.sequences().resize(1);
    debug_line
    debug((long long) snsp.size())
//    sc.sequences[0] = sequence_node_shared_pointer(new SequenceNode());
//    sc(0) = new SequenceNode();
    debug_line
    snsp.sequences().resize(1);
    debug_line
    snsp(0).resize(1);
    debug_line
    snsp(0)[0] = 5;
    debug_line
    SequenceNodeSharedPointer sn = snsp(0);
//    SequenceNode sn = *sc.sequences[0];
    debug_line
    debug((long long) s)
    debug((const char*) s)
    debug_line
    debug_line
//    sequence_node_shared_pointer ssp = sequence_node_shared_pointer(new Sequence("test"));
//    debug_line
//    s = (const char*) *ssp;
//    debug_line
//    debug((bool) s)
//    debug((long long) s)
//    debug((long double) s)
//    debug((const char*) s)
//    debug_line
//    sv.push_back(ssp);
//    debug_line
//    debug((const char*) *sv[0])
//    debug_line
//    s=*sv[0];
//    debug_line
//    debug((bool) s)
//    debug((long long) s)
//    debug((long double) s)
//    debug((const char*) s)
//    debug_line
//    debug_line
//    debug_line
//    debug_line
//    debug_line
//    debug_line
//    seq << 5;
//    if(seq == Sequence("test") << 5) debug("OK")
//    else debug("ERROR")
//    seq = 2;
//    seq << "asd>;asd\\>:asd";
//    seq << 5.4;
//    seq.from_text("$:t:<asdqwe>:[$:t:<asd>;]:[$:t:<qwe>;]:[$:i:<123>;]:[$:f:<5.6>;];");
//    debug(seq.to_text())
//    debug(((Sequence) 9 << "test" << 8.6).text())
//    throw std::exception();
//    throw 0;
    exception_throw
    exception_catch
    exception_print_stack_trace
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
