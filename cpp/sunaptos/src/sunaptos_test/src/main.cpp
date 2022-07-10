#include "debug.h"
#include "buffer.h"
#include "sequence.h"

int main(int argc, char** argv)
{
  debug("sunaptos_test")
  
  buffer b1;
  b1.set("test", 4);
  debug((const char*) b1.get())
  
  sequence s1;
  s1 = "test-seq";
  debug((const char*) s1)
  
  return 0;
}
