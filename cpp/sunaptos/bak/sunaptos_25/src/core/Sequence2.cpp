#include "sunaptos.h"
#include "Sequence2.h"

sequence::sequence(): pb(0), sz(0)
{
}

sequence::sequence(sequence& seq)
{
  copy(seq);
}

sequence::sequence(element& e)
{
  get(0) = e;
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
{/*
  Buffer b;

  si >> wd;
  si >> sz;
  // resize
  resize(&Sequence2(sz));
  // raw-read
  b.resize(wd * sz);
  si >> b;
  memcpy(pb, b.get(), b.size());
  // read sub-sequences and replace sender pointer read with previous raw copy with newly created pointers
  // read number of sub-sequences to read
  number nseq = 0;
  si >> nseq;
  // read each sub-sequence
  for(number i = 0; i < nseq; i++)
  {
    // read index value
    number iseq = 0;
    si >> iseq;
    // create sub-sequence
    Sequence* seq = new Sequence();
    si >> *seq;
    // put sub-sequence at correct index (replacing bad addresses read with raw-read)
    set(*seq, &Sequence2(iseq));
  }*/
}

void sequence::write(StreamOutput& so)
{/*
  Buffer b;

  so << wd;
  so << sz;
  // raw-write
  b.set(pb, wd * sz);
  so << b;
  // todo: improve performance avoiding the double loop IF StreamOutput allow positioning
  // write sub-sequences if any
  // count sub-sequences
  number nseq = 0;
  for(number i = 0; i < sz; i++)
  {
//    Sequence* seq = dynamic_cast<Sequence*>(get<Streamable*>(i));
    Sequence* seq = get<Sequence*>(i);
    if(issequence(seq))
    {
      nseq++;
    }
  }
  // write number of sub-sequences
  so << nseq;
  for(number i = 0; i < sz; i++)
  {
    Sequence* seq = get<Sequence*>(i);
    if(issequence(seq))
    {
      // write index where to put
      so << i;
      // write sub-sequence
      so << *seq;
    }
  }*/
}

element sequence::size()
{
  return (element) sz;
}

void sequence::resize(sequence_index size)
{
  pb = (element*) realloc(pb, size * sizeof(element));
  sz = size;
}

element& sequence::get(sequence_index i)
{
  if(i < 0)
  {
    throw 0;
  }
  else if(sz <= i)
  {
    resize(i + 1);
  }
  return pb[i];
}

sequence& sequence::del(sequence_index i1, sequence_index i2)
{
  // delete subblock, boundaries included
  if(i1 < 0 || sz <= i1 || i2 < 0 || sz <= i2)
  {
    throw 0;
  }
  for(sequence_index ind = i2 + 1; ind < sz; ++ind)
  {
    get(i1 + ind - i2 - 1) = get(ind);
  }
  resize(sz - (i2 - i1 + 1));
  return *this;
}

element& sequence::get(element i)
{
  debug("[sequence] get - sz = " << (long) sz)
  return get(i);
}

sequence& sequence::ins(element e)
{
  debug("[sequence] ins - sz = " << (long) sz)
  get(sz) = e;
  return *this;
}

sequence& sequence::del(element i)
{
  debug("[sequence] del - sz = " << (long) sz)
  // TODO delete subblock, not only one index
  del(i, i);
}

char* sequence::text()
{
  stringstream s;
  
  s << "[" << (char*) *this << "]\n";

  for(sequence_index i = 0; i < sz; i++)
  {
    s << "[" << typeid(get(i)).name() << "]\n";
    s << "[type: " << get(i).t << " - value llu: " << get(i).llu << " - value l: " << get(i).l << "]\n";
    /*try
    {
//      s << "[\n" << get(i).seq->text() << "]\n";
      sequence* seq = dynamic_cast<sequence*>(get(i).srv);
      s << "[\n" << seq->text() << "]\n";
    }
    catch(...)
    {
      s << "[" << get(i).llu << "]\n";
    }*/
    s << "\n";
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
  if(e.sz != 0)
  {
    sz = e.sz;
    pb = (element*) realloc(pb, sz * sizeof(element));
    memcpy(pb, e.pb, sz * sizeof(element));
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
