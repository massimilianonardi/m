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
  si.read(sz);
  t = *(sequence_type*) sz.get();
  // read elems buffer size
  si.read(sz);
  elems.resize(*(long*) sz.get());
  // raw-read elems buffer
  si.read(elems);
  // read number of sub-Sequences
  si.read(sz);
  resize(*(long*) sz.get());
  // read sub-Sequences if any
  for(long i = 0; i < (long) size(); ++i)
  {
    // read sub-Sequence
    StreamableSequence ss;
    ss.read(si);
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
  so.write(sz);
  // write elems buffer size
  sizetmp = elems.size();
  sz.set(&sizetmp, sizeof(long));
  so.write(sz);
  // raw-write elems buffer
  so.write(elems);
  // write number of sub-Sequences
  sizetmp = (long) size();
  sz.set(&sizetmp, sizeof(long));
  so.write(sz);
  // write sub-Sequences if any
  for(long i = 0; i < (long) size(); ++i)
  {
    // write sub-Sequence
    StreamableSequence(get(i)).write(so);
  }
}
