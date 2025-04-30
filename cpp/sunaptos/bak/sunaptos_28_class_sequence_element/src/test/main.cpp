#include "debug.h"
#include "sequence.h"
#include "buffer.h"

union elem2
{
  // 1
  bool b;
  char c;
  // 2-4
  int i;
  unsigned int iu;
  // 4
  long l;
  unsigned long lu;
  void* v;
  sequence* seq;
  // 8
  long long ll;
  unsigned long long llu;
  double d;
  // 16
  long double dl;
};
enum type2
{
  unspecified_pointer_t = -1,
  unspecified_t = 0,
  sequence_t = 1,
  service_t = 2,
  boolean_t = 10,
  integer_t = 20,
  floating_point_t = 30,
  character_t = 40,
  date_t = 50,
  timestamp_t = 60,
  email_t = 70,
};

int main(int argc, char** argv)
{
  try
  {
    debug("[Process 00]")
    sequence params;
    
    for(int i = 0; i < argc; i++)
    {
      debug("[Process 00] argument index: " << i << " - argument value: " << argv[i])
//      params << argv[i];
//      params << new sequence(argv[i]);
//      debug("[Process 00] argument index: " << i << " - argument loaded value: " << params[i].seq)
    }
    debug("[Process 00]")
    
    debug("size of sequence: " << sizeof(sequence))
    debug("size of buffer: " << sizeof(Buffer))
    debug("size of type: " << sizeof(type2))
    debug("size of elem: " << sizeof(elem2))
    debug("size of sequence_element: " << sizeof(sequence_element))
    debug("\n")
    
    // construct
    sequence seq;
    sequence s = sequence();
    
    // assign construct
    seq = 5;
    seq = 8.9;
    s.resize(8);
    s = "trallallero trallalla";
    
    // manipulate elements
    sequence s1 = "test s1";
    s.get(3) = s1;
    s.get(6) = seq;
    sequence_element se = seq;
    s.get(7) = se;
//    s.get(5) = &(sequence) "test";
//    seq = "test";
//    s.get(5) = seq;
//    sequence st = s.get(5).seq();
//    s.get(5).seq() = "test";
//    s.get(8) = &(sequence) 9;
//    s.get(8).seq() = 9;
    vector<sequence> vs;
    vs.resize(5);
    vs[0] = "vec test";
    vs[1] = 123;
    vs[2] = 34.56;
    
    // log
    debug("seq: " << seq.text())
    debug("s: " << s.text())
    

    debug("[Process 90] [TERMINATION SUCCESSFUL]")
  }
  catch(const char* msg)
  {
    printf(msg);
    getchar();
  }
  catch(...)
  {
    debug("[Process 00] [Undefined Exception!]")
    getchar();
  }

  debug("[Process 99] [EXIT]")
  return 0;
}
