
#include "Exception.h"
#include "debug.h"
#include "sequence.h"
#include "Buffer.h"

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

void test_exception()
{
  debug("[EXCEPTION]")

  debug("[construct/destruct]")

  exception e1;
  debug_line
  exception e2("file", 1, "function", exception_type::std_exception, "info");
  debug_line
  exception e3("file", 1, "function");
  debug_line
  delete new exception();

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
}

void test_buffer()
{
  debug("[BUFFER]")

  debug("[construct/destruct]")

  Buffer b1;
  debug((char*) b1.resize(1).get())
  Buffer b2;
  debug((char*) b2.get())
  Buffer b3;
  debug((char*) b3.get())
  delete new Buffer();

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

//  b1.ins('X', b1.size() + 1);
//  b1.ins(b2, b1.size() + 1);
//  b1.del(b1.size(), 1);
//  b1.del(b1.size() - 1, 2);
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
//  debug((char*) b2.get())
  debug(b2.size())

  debug("[equality]")

  b1.set((void*) "12345678", 8);
  b2.set((void*) "test", 4);
  b1 = b2;
  debug((bool) (b1 == b2))

  b1.set((void*) "12345678", 8);
  b2.set((void*) "test", 4);
  debug((bool) (b1 == b2))
}

void test_sequence()
{
  debug("[SEQUENCE]")

  debug("sequence - size: " << sizeof(sequence))

  debug("[construct/destruct]")
  sequence s1;
  debug_line
  sequence s2(5);
  debug_line
  sequence s3(4.9);
  debug_line
  sequence s4("test");
  debug_line
  debug(s1.to_string())
  debug(s2.to_string())
  debug(s3.to_string())
  debug(s4.to_string())
  debug((int) s3)
  debug((double) s3)
  debug((char*) s3)
  delete new sequence();

  debug("[manipulation]")

  sequence b1;
  sequence b2;
  b1.resize(4);
  debug((char*) b1)
  debug(b1.size())

  b1[2] = 'H';
  debug((char*) b1)
  debug(b1.size())

  debug("[insert]")

  b1 = "test";
  b1.ins('A', 0);
  debug((char*) b1)
  debug(b1.size())

  b1 = "test";
  b1.ins('M', 2);
  debug((char*) b1)
  debug(b1.size())

  b1 = "test";
  b1.ins('Z', b1.size());
  debug((char*) b1)
  debug(b1.size())

  b1 = "test";
  b2 = "_b2A_";
  b1.ins(b2, 0);
  debug((char*) b1)
  debug(b1.size())

  b1 = "test";
  b2 = "_b2M_";
  b1.ins(b2, 2);
  debug((char*) b1)
  debug(b1.size())

  b1 = "test";
  b2 = "_b2Z_";
  b1.ins(b2, b1.size());
  debug((char*) b1)
  debug(b1.size())

  b1 = "test";
  b1.ins(b1, 2);
  debug((char*) b1)
  debug(b1.size())

  debug("[del]")

  b1 = "test";
  b1.del(0, 2);
  debug((char*) b1)
  debug(b1.size())

  b1 = "test";
  b1.del(1, 2);
  debug((char*) b1)
  debug(b1.size())

  b1 = "test";
  b1.del(2, 2);
  debug((char*) b1)
  debug(b1.size())

  b1 = "test";
  b1.del(2);
  debug((char*) b1)
  debug(b1.size())

  debug("[move]")

  b1 = "12345678";
  b1.move(0, 2, 0);
  debug((char*) b1)
  debug(b1.size())

  b1 = "12345678";
  b1.move(0, 2, 2);
  debug((char*) b1)
  debug(b1.size())

  b1 = "12345678";
  b1.move(0, 2, 6);
  debug((char*) b1)
  debug(b1.size())

  b1 = "12345678";
  b1.move(2, 3, 0);
  debug((char*) b1)
  debug(b1.size())

  b1 = "12345678";
  b1.move(2, 3, 4);
  debug((char*) b1)
  debug(b1.size())

  b1 = "12345678";
  b1.move(2, 3, 5);
  debug((char*) b1)
  debug(b1.size())

  b1 = "12345678";
  b1.move(4, 4, 0);
  debug((char*) b1)
  debug(b1.size())

  b1 = "12345678";
  b1.move(4, 4, 2);
  debug((char*) b1)
  debug(b1.size())

  b1 = "12345678";
  b1.move(4, 4, 4);
  debug((char*) b1)
  debug(b1.size())

  debug("[exceptions]")


  debug("[copy/move]")

  b1 = "12345678";
  b2 = "test";
  sequence b4(b1);
  debug((char*) b1)
  debug(b1.size())
  debug((char*) b4)
  debug(b4.size())

  b1 = "12345678";
  b2 = "test";
  b1 = b2;
  debug((char*) b1)
  debug(b1.size())
  debug((char*) b2)
  debug(b2.size())

  b1 = "12345678";
  b2 = "test";
  b1 = std::move(b1);
  debug((char*) b1)
  debug(b1.size())
  debug((char*) b2)
  debug(b2.size())

  b1 = "12345678";
  b2 = "test";
  b1 = std::move(b2);
  debug((char*) b1)
  debug(b1.size())
  debug((char*) b2)
  debug(b2.size())

  debug("[link]")

  b1 = "12345678";
  b2 = "test";
  debug((char*) b1)
  debug(b1.size())
  debug((char*) b2)
  debug(b2.size())
  b2 = b1.link();
  debug((char*) b1)
  debug(b1.size())
  debug((char*) b2)
  debug(b2.size())

  b1 = "12345678";
  b2 = "test";
  debug((char*) b1)
  debug(b1.size())
  debug((char*) b2)
  debug(b2.size())
  b2 = &b1;
  b1 = "orimodi";
  debug((char*) b1)
  debug(b1.size())
  debug((char*) b2)
  debug(b2.size())

  b1.unlink() = "12345678";
  b2 = "test";
  b1.links_ins(&b2);
  debug(b1.to_string())
  debug(b2.to_string())
  b1(0) = &b2;
  debug(b1.to_string())
  debug(b2.to_string())
//  b2 = std::move(sequence("modi"));
  b2 = "modi";
  debug(b1.to_string())
  debug(b2.to_string())
  debug((char*) b1(0))
//  debug(b1.size())
//  debug((char*) b2)
//  debug(b2.size())

  debug("[equality]")

  b1 = "12345678";
  b2 = "test";
  b1 = b2;
  debug((bool) (b1 == b2))

  b1 = "12345678";
  b2 = "test";
  debug((bool) (b1 == b2))

  debug("[various]")

  s1.links_ins("test").links_ins("-append");
  debug_line
  s1.links_ins("-test>:escaping>;terminators-");
  debug(s1.to_string())
  s1 = "";
  s1.links_ins("test").links_ins("-append");
  s1.links_ins('H');
  s1.links_ins(7);
  s1.links_ins("H");
  debug(s1.to_string())
  (s1 = "first").links_ins(((sequence() = "second").links_ins("third")));
  s1.links_ins("fourth");
  debug(s1.to_string())
  debug(s1(0).to_string())
  debug(s1(0)(0).to_string())
//  Sequence i = empty_sequence.links_ins(0);
  sequence i = sequence();
  debug_line
  i = i.links_ins(0);
  debug(i.to_string())
  debug(s1.links_get(i).to_string())
  i = i.links_ins(0);
  debug(i.to_string())
  debug(s1.links_get(i).to_string())
//  s1 << ((seq) "s0" << ((seq) "s1" << ((seq) "s2" << (seq) "s3")));
  s1.links_ins((sequence("s0").links_ins((sequence("s1").links_ins((sequence("s2").links_ins("s3")))))));
  debug(s1.to_string())
  i = (sequence().links_ins(2).links_ins(0));
  debug(i.to_string())
  debug(s1.links_get(i).to_string())
  debug(s1.links_get(sequence().links_ins(2).links_ins(0)).to_string())
  s1 = "test";
  s1.links_ins((sequence("s0").links_ins((sequence("s1").links_ins((sequence("s2").links_ins("s3")))))));
  debug(s1.to_string())
  s1.from_string("$:s:<>:[$:s:<test>;]:[$:s:<-append>;]:[$:n:<72>;]:[$:n:<7>;]:[$:s:<H>;];");
  debug(s1.to_string())
//  s1 = "test";
//  s1 | "s0" | "s1" | "s2" | "s3";
//  debug(s1.to_string())
//  if(s1 == Sequence("test") << 5) debug("OK");
//  s1.op(1 << 2 << 3);
}

int main(int argc, char** argv)
{
  debug("[test 00] [START]")
  try
  {
    debug("[test 01] [EXCEPTION]")
    test_exception();
    debug("[test 02] [BUFFER]")
    test_buffer();
    debug("[test 03] [SEQUENCE]")
    test_sequence();
    debug("[test 90] [TERMINATION SUCCESSFUL]")
  }
  catch(const char* msg)
  {
    printf(msg);
    getchar();
  }
  catch(...)
  {
    debug("[test 00] [Undefined Exception!]")
    getchar();
  }

  debug("[test 99] [EXIT]")
  return 0;
}
/*
* /
int main(int argc, char** argv)
{
  return 0;
}
*/
