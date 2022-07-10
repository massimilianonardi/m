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
    debug("[test sequence 00]")
    debug("SequenceNode - size: " << sizeof(SequenceNode))
    
    debug("[EXCEPTION]")
    
    debug("[constructors]")
    
    Exception e1;
    debug_line
    Exception e2("file", 1, "function", ExceptionType::std_exception, "info");
    debug_line
    Exception e3("file", 1, "function");
    
    debug("[manipulation]")
    
    debug(e1.text())
    debug(e2.text())
    debug(e3.text())
    debug((bool)(e1 == e1))
    debug((bool)(e2 == e3))
    e1.add(e2);
    e1.add("FILE", 2, "FUNCTION");
    e1.checkpoint("file", 1, "function");
    e1.rethrow("file", 1, "function");
    debug(e1.text())
    
    exception_try
    debug("[BUFFER]")
    
    debug("[constructors]")
    
    Buffer b1;
    debug_line
    Buffer b2;
    debug_line
    Buffer b3;
    
    debug("[manipulation]")
    
    b1.resize(4);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "test", 4);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "reset", 6);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.resize(4);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1[2] = 'H';
    debug((char*) b1.get())
    debug(b1.size())
    
    debug("[insert]")
    
    b1.set((void*) "test", 4);
    b1.ins('A', 0);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "test", 4);
    b1.ins('M', 2);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "test", 4);
    b1.ins('Z', b1.size());
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "test", 4);
    b2.set((void*) "_b2A_", 5);
    b1.ins(b2, 0);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "test", 4);
    b2.set((void*) "_b2M_", 5);
    b1.ins(b2, 2);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "test", 4);
    b2.set((void*) "_b2Z_", 5);
    b1.ins(b2, b1.size());
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "test", 4);
    b1.ins(b1, 2);
    debug((char*) b1.get())
    debug(b1.size())
    
    debug("[del]")
    
    b1.set((void*) "test", 4);
    b1.del(0, 2);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "test", 4);
    b1.del(1, 2);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "test", 4);
    b1.del(2, 2);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "test", 4);
    b1.del(2);
    debug((char*) b1.get())
    debug(b1.size())
    
    debug("[move]")
    
    b1.set((void*) "12345678", 8);
    b1.move(0, 2, 0);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "12345678", 8);
    b1.move(0, 2, 2);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "12345678", 8);
    b1.move(0, 2, 6);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "12345678", 8);
    b1.move(2, 3, 0);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "12345678", 8);
    b1.move(2, 3, 4);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "12345678", 8);
    b1.move(2, 3, 5);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "12345678", 8);
    b1.move(4, 4, 0);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "12345678", 8);
    b1.move(4, 4, 2);
    debug((char*) b1.get())
    debug(b1.size())
    
    b1.set((void*) "12345678", 8);
    b1.move(4, 4, 4);
    debug((char*) b1.get())
    debug(b1.size())
    
    debug("[exceptions]")
    
//    b1.ins('X', b1.size() + 1);
//    b1.ins(b2, b1.size() + 1);
//    b1.del(b1.size(), 1);
//    b1.del(b1.size() - 1, 2);
    debug_line
    
    debug("[copy/move]")
    
    b1.set((void*) "12345678", 8);
    b2.set((void*) "test", 4);
    Buffer b4(b1);
    debug((char*) b1.get())
    debug(b1.size())
    debug((char*) b4.get())
    debug(b4.size())
    
    b1.set((void*) "12345678", 8);
    b2.set((void*) "test", 4);
    b1 = b2;
    debug((char*) b1.get())
    debug(b1.size())
    debug((char*) b2.get())
    debug(b2.size())
    
    b1.set((void*) "12345678", 8);
    b2.set((void*) "test", 4);
    b1 = std::move(b1);
    debug((char*) b1.get())
    debug(b1.size())
    debug((char*) b2.get())
    debug(b2.size())
    
    b1.set((void*) "12345678", 8);
    b2.set((void*) "test", 4);
    b1 = std::move(b2);
    debug((char*) b1.get())
    debug(b1.size())
//    debug((char*) b2.get())
    debug(b2.size())
    
    debug("[equality]")
    
    b1.set((void*) "12345678", 8);
    b2.set((void*) "test", 4);
    b1 = b2;
    debug((bool) (b1 == b2))
    
    b1.set((void*) "12345678", 8);
    b2.set((void*) "test", 4);
    debug((bool) (b1 == b2))
    
    debug("[SEQUENCE]")
    
    debug("[common constructors]")
    Sequence s1;
    debug_line
    Sequence s2(5);
    debug_line
    Sequence s3(4.9);
    debug_line
    Sequence s4("test");
    debug_line
    debug(s1.to_text())
    debug(s2.to_text())
    debug(s3.to_text())
    debug(s4.to_text())
    debug((int) s3)
    debug((double) s3)
    debug((char*) s3)
    s1 << "test" << "-append";
    debug(s1.to_text())
    s1 = "";
    s1 << "test" << "-append";
    s1 << 'H';
    s1 << "H";
//    s1() << "sub";
    debug(s1.to_text())
    if(s1 == Sequence("test") << 5) debug("OK")
//    snsp.resize(1);
//    snsp.resize(2)[1] = 4;
//    debug_line
//    snsp[0] = 8;
//    s=snsp[0];
//    debug_line
//    debug((long long) s)
//    debug((const char*) s)
//    debug_line
//    snsp().resize(1);
//    snsp(0).resize(1);
//    snsp(0)[0] = 3;
//    debug_line
//    debug((long long) snsp.size())
//    debug_line
//    snsp().resize(1);
//    debug_line
//    snsp(0).resize(1);
//    snsp(0)().resize(1);
//    debug_line
//    snsp(0)[0] = 5;
//    debug_line
//    SequenceNode sn;
//    debug_line
//    sn = snsp;
//    debug_line
//    sn = snsp(0);
//    debug_line
////    sn = "test";
//    debug((long long) s)
//    debug((const char*) s)
//    debug_line
//    Sequence test;
//    debug_line
//    test = "test";
//    debug_line
//    Sequence v3(3);
//    debug_line
//    Sequence v2("test");
//    debug_line
//    Sequence v = "test";
//    debug("\n[ bool: " << (bool) v << " - char: " << (char) v << " - short int: " << (short int) v << " - int: " << (int) v << " - long int: " << (long int) v << " - long long int: " << (long long int) v << " - unsigned char: " << (unsigned char) v << " - unsigned short int: " << (unsigned short int) v << " - unsigned int: " << (unsigned int) v << " - unsigned long int: " << (unsigned long int) v << " - unsigned long long int: " << (unsigned long long int) v << " - float: " << (float) v << " - double: " << (double) v << " - long double: " << (long double) v << " - void*: " << (void*) v << " - wchar_t: " << (wchar_t) v << " - char*: " << (char*) v << " - wchar_t*: " << (wchar_t*) v << " ]")
//    debug("\n[ t:" << (int) v.type() << " b: " << (bool) v << " c: " << (char) v << " si: " << (short int) v << " i: " << (int) v << " li: " << (long int) v << " lli: " << (long long int) v << " uc: " << (unsigned char) v << " usi: " << (unsigned short int) v << " ui: " << (unsigned int) v << " uli: " << (unsigned long int) v << " ulli: " << (unsigned long long int) v << " f: " << (float) v << " d: " << (double) v << " ld: " << (long double) v << " v*: " << (void*) v << " wc: " << (wchar_t) v << " c*: " << (char*) v << " wc*: " << (wchar_t*) v << " ]")
//    debug("\n[ b: " << (bool) v << " c: " << (char) v << " si: " << (short int) v << " i: " << (int) v << " li: " << (long int) v << " lli: " << (long long int) v << " uc: " << (unsigned char) v << " usi: " << (unsigned short int) v << " ui: " << (unsigned int) v << " uli: " << (unsigned long int) v << " ulli: " << (unsigned long long int) v << " f: " << (float) v << " d: " << (double) v << " ld: " << (long double) v << " v*: " << (void*) v << " wc: " << (wchar_t) v << " c*: " << (char*) v << " wc*: " << (wchar_t*) v << " ]")
//    debug_line
//    snsp = Sequence("test");
//    debug_line
//    snsp().resize(2);
//    debug_line
//    snsp(0) = "sub-test";
//    debug_line
//    snsp << Sequence("append-test-");
//    snsp << "append-test-";
//    debug_line
//    snsp[3] = 'z';
//    snsp[4] = 'z';
//    snsp[5] = 0;
//    snsp[5] = 'z';
//    snsp[6] = 'z';
//    snsp[14] = 0;
//    snsp(1) = snsp.size();
//    snsp() << Sequence("sub2");
//    debug_line
//    debug(snsp.text())
//    debug_line
//    debug(snsp.to_text())
//    debug_line
//    debug(v.text())
//    debug_line
//    debug(v.to_text())
//    debug_line
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
    
    debug("[test sequence 90] [TERMINATION SUCCESSFUL]")
  }
  catch(const char* msg)
  {
    printf(msg);
    getchar();
  }
  catch(...)
  {
    debug("[test sequence 00] [Undefined Exception!]")
    getchar();
  }

  debug("[test sequence 99] [EXIT]")
  return 0;
}
