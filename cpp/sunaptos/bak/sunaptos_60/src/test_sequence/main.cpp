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
    Sequence s;
    Sequence snsp;
    debug_line
    snsp.resize(1);
    snsp.resize(2)[1] = 4;
    debug_line
    snsp[0] = 8;
    s=snsp[0];
    debug_line
    debug((long long) s)
    debug((const char*) s)
    debug_line
    snsp.sequences().resize(1);
    snsp(0).resize(1);
    snsp(0)[0] = 3;
    debug_line
    debug((long long) snsp.size())
    debug_line
    snsp().resize(1);
    debug_line
    snsp(0).resize(1);
    snsp(0)().resize(1);
    debug_line
    snsp(0)[0] = 5;
    debug_line
    SequenceNode sn;
    debug_line
    sn = snsp;
    debug_line
    sn = snsp(0);
    debug_line
//    sn = "test";
    debug((long long) s)
    debug((const char*) s)
    debug_line
    Sequence test;
    debug_line
    test = "test";
    debug_line
    Sequence v3(3);
    debug_line
    Sequence v2("test");
    debug_line
    Sequence v = "test";
//    debug("\n[ bool: " << (bool) v << " - char: " << (char) v << " - short int: " << (short int) v << " - int: " << (int) v << " - long int: " << (long int) v << " - long long int: " << (long long int) v << " - unsigned char: " << (unsigned char) v << " - unsigned short int: " << (unsigned short int) v << " - unsigned int: " << (unsigned int) v << " - unsigned long int: " << (unsigned long int) v << " - unsigned long long int: " << (unsigned long long int) v << " - float: " << (float) v << " - double: " << (double) v << " - long double: " << (long double) v << " - void*: " << (void*) v << " - wchar_t: " << (wchar_t) v << " - char*: " << (char*) v << " - wchar_t*: " << (wchar_t*) v << " ]")
//    debug("\n[ t:" << (int) v.type() << " b: " << (bool) v << " c: " << (char) v << " si: " << (short int) v << " i: " << (int) v << " li: " << (long int) v << " lli: " << (long long int) v << " uc: " << (unsigned char) v << " usi: " << (unsigned short int) v << " ui: " << (unsigned int) v << " uli: " << (unsigned long int) v << " ulli: " << (unsigned long long int) v << " f: " << (float) v << " d: " << (double) v << " ld: " << (long double) v << " v*: " << (void*) v << " wc: " << (wchar_t) v << " c*: " << (char*) v << " wc*: " << (wchar_t*) v << " ]")
//    debug("\n[ b: " << (bool) v << " c: " << (char) v << " si: " << (short int) v << " i: " << (int) v << " li: " << (long int) v << " lli: " << (long long int) v << " uc: " << (unsigned char) v << " usi: " << (unsigned short int) v << " ui: " << (unsigned int) v << " uli: " << (unsigned long int) v << " ulli: " << (unsigned long long int) v << " f: " << (float) v << " d: " << (double) v << " ld: " << (long double) v << " v*: " << (void*) v << " wc: " << (wchar_t) v << " c*: " << (char*) v << " wc*: " << (wchar_t*) v << " ]")
    debug_line
    snsp = Sequence("test");
    snsp().resize(0);
    debug_line
    debug(snsp.text())
    debug_line
    debug(snsp.to_text())
    debug_line
//    debug(v.text())
    debug_line
//    debug(v.to_text())
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

//    exception_throw
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
