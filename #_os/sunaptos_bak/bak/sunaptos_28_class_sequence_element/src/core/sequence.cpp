#include "sunaptos.h"

sequence::sequence(): pb(0), sz(0)
{
}

sequence::sequence(sequence& seq): pb(0), sz(0)
{
  copy(seq);
}

sequence::sequence(const sequence& seq): pb(0), sz(0)
{
  *this = seq;
}

sequence::sequence(const char* e): pb(0), sz(0)
{
  // TODO decide how to handle text and support utf-8
  long size = strlen(e) + 1;
  resize(size / sizeof(element) + 1);
  memcpy(pb, e, size);
}

sequence::~sequence()
{
  // todo: delete all sequence pointers created by sequence when adding strings (char and wchar)
  // todo: find a way to avoid the "new sequence" constructs used with strings...that is avoid strings!!!
  // using new inside sequence means that responsibility for sequence pointers cleanup is no longer user's solely,
  // thus sequence must know what to delete when calling destructor or "del", but even so, there is ambiguity because
  // sequence cannot know if user still needs a pointer...
  free(pb);
}

void sequence::read(StreamInput& si)
{
  // TODO avoid circular loops
  // TODO platform independent element (size and numbers/characters representations)
  Buffer b;

  si >> sz;
  // resize
  resize(sz.lu * sizeof(element));
  // raw-read
  b.resize(sz.lu * sizeof(element));
  si >> b;
  memcpy(pb, b.get(), b.size());
  // read sub-sequences and replace sender pointer read with previous raw copy with newly created pointers
  // read number of sub-sequences to read
  element nseq = 0;
  si >> nseq;
  // read each sub-sequence
  for(element i = 0; i.lu < nseq.lu; ++i.lu)
  {
    // read index value
    element iseq = 0;
    si >> iseq;
    // create sub-sequence
    sequence* seq = new sequence();
    si >> *seq;
    // put sub-sequence at correct index (replacing bad addresses read with raw-read)
    get(iseq) = seq;
  }
}

void sequence::write(StreamOutput& so)
{
  // TODO avoid circular loops
  // TODO platform independent element (size and numbers/characters representations)
  Buffer b;
  Buffer n;
  n.resize(sizeof(unsigned long));

  so << sz;
  // raw-write
  b.set(pb, sz.lu * sizeof(element));
  so << b;
  // todo: improve performance avoiding the double loop IF StreamOutput allow positioning
  // write sub-sequences if any
  // count sub-sequences
  element nseq = 0;
  for(element i = 0; i.lu < sz.lu; ++i.lu)
  {
    if(get(i).t == element::sequence_t)
    {
      ++nseq.lu;
    }
  }
  // write number of sub-sequences
  so << nseq;
  for(element i = 0; i.lu < sz.lu; ++i.lu)
  {
    element e = get(i);
    if(e.t == element::sequence_t)
    {
      // write index where to put
      so << i;
      // write sub-sequence
      so << *e.seq;
    }
  }
}

element sequence::size()
{
  return (element) sz;
}

void sequence::resize(element size)
{
  pb = (element*) realloc(pb, size.lu * sizeof(element));
  sz = size;
}

sequence& sequence::del(element i1, element i2)
{
  // delete subblock, boundaries included
  if(i1.lu < 0 || sz.lu <= i1.lu || i2.lu < 0 || sz.lu <= i2.lu)
  {
    throw 0;
  }
  for(element ind = i2.lu + 1; ind.lu < sz.lu; ++ind.lu)
  {
    get(i1.lu + ind.lu - i2.lu - 1) = get(ind);
  }
  resize(sz.lu - (i2.lu - i1.lu + 1));
  return *this;
}

element& sequence::get(element i)
{
  if(i.lu < 0)
  {
    throw 0;
  }
  else if(sz.lu <= i.lu)
  {
    resize(i.lu + 1);
  }
  return pb[i.lu];
}

sequence& sequence::ins(element e)
{
  get(sz) = e;
  return *this;
}

sequence& sequence::del(element i)
{
  // TODO delete subblock, not only one index
  del(i, i);
}

char* sequence::text()
{
  stringstream s;
  
  s << "[" << (char*) *this << "]\n";

  for(element i = 0; i.lu < sz.lu; ++i.lu)
  {
//    s << "[" << typeid(get(i)).name() << "]\n";
    s << "[type: " << get(i).t << " - value c: " << get(i).c << " - value l: " << get(i).l << " - value llu: " << get(i).llu << "]\n";
//    if(get(i).t == element::sequence_t)
//    {
//      get(i).seq->text();
//    }
//    s << "\n";
  }
  return (char*) s.str().c_str();
}

sequence::operator char*()
{
  // TODO decide how to handle text and support utf-8
  return (char*) pb;
}

sequence& sequence::copy(sequence& e)
{
  if(e.sz.lu != 0)
  {
    sz = e.sz;
    pb = (element*) realloc(pb, sz.lu * sizeof(element));
    memcpy(pb, e.pb, sz.lu * sizeof(element));
  }
  return *this;
}

sequence& sequence::operator=(sequence e)
{
  return copy(e);
}

sequence& sequence::operator=(sequence& e)
{
  return copy(e);
}
