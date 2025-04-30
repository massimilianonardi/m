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

void test_exception()
{
  debug("[EXCEPTION]")

  debug("[construct/destruct]")

  Exception e1;
  debug_line
  Exception e2("file", 1, "function", ExceptionType::std_exception, "info");
  debug_line
  Exception e3("file", 1, "function");
  debug_line
  delete new Exception();

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

  debug("SequenceNode - size: " << sizeof(SequenceNode))

  debug("[construct/destruct]")
  Sequence s1;
  debug_line
  Sequence s2(5);
  debug_line
  Sequence s3(4.9);
  debug_line
  Sequence s4("test");
  debug_line
  debug(s1.to_string())
  debug(s2.to_string())
  debug(s3.to_string())
  debug(s4.to_string())
  debug((int) s3)
  debug((double) s3)
  debug((char*) s3)
  s1 << "test" << "-append";
  s1 << "-test>:escaping>;terminators-";
  debug(s1.to_string())
  s1 = "";
  s1 << "test" << "-append";
  s1 << 'H';
  s1 << 7;
  s1 << "H";
  debug(s1.to_string())
  if(s1 == Sequence("test") << 5) debug("OK");
}

int main(int argc, char** argv)
{
  debug("[test sanboxed 00] [START]")
  try
  {
    debug("[test sanboxed 01] [EXCEPTION]")
    test_exception();
    debug("[test sanboxed 02] [BUFFER]")
    test_buffer();
    debug("[test sanboxed 03] [SEQUENCE]")
    test_sequence();
    debug("[test sanboxed 90] [TERMINATION SUCCESSFUL]")
  }
  catch(const char* msg)
  {
    printf(msg);
    getchar();
  }
  catch(...)
  {
    debug("[test sanboxed 00] [Undefined Exception!]")
    getchar();
  }

  debug("[test sanboxed 99] [EXIT]")
  return 0;
}
