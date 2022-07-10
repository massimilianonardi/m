#include "streamablesequence.h"

// streamable interface
void StreamableSequence::read(StreamInput& si)
{
  // TODO avoid circular loops
  // TODO platform independent element (size and numbers/characters representations)
  Buffer sz;
  sz.resize(sizeof(long));
  
  // read sequence type
  sz.set(&t, sizeof(t));
  si >> sz;
  t = *(sequence_type*) sz.get();
  // read elems buffer size
  si >> sz;
  elems.resize(*(long*) sz.get());
  // raw-read elems buffer
  si >> elems;
  // read number of sub-Sequences
  si >> sz;
  resize(*(long*) sz.get());
  // read sub-Sequences if any
  for(long i = 0; i < (long) size(); ++i)
  {
    // read sub-Sequence
    StreamableSequence ss;
    si >> ss;
    get(i) = ss;
  }
}

void StreamableSequence::write(StreamOutput& so) const
{
  // TODO avoid circular loops
  // TODO platform independent element (size and numbers/characters representations)
  Buffer sz;
  long sizetmp = 0;
  
  // write sequence type
  sz.set(&t, sizeof(t));
  so << sz;
  // write elems buffer size
  sizetmp = elems.size();
  sz.set(&sizetmp, sizeof(long));
  so << sz;
  // raw-write elems buffer
  so << elems;
  // write number of sub-Sequences
  sizetmp = (long) size();
  sz.set(&sizetmp, sizeof(long));
  so << sz;
  // write sub-Sequences if any
  for(long i = 0; i < (long) size(); ++i)
  {
    // write sub-Sequence
    so << StreamableSequence(get(i));
  }
}
