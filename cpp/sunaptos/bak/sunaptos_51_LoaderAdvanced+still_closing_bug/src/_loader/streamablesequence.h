#ifndef _STREAMABLESEQUENCE_H
#define	_STREAMABLESEQUENCE_H

#include "sequence.h"
#include "streamable.h"

class StreamableSequence: virtual public Streamable, virtual public Sequence
{
public:
  StreamableSequence(): Sequence(){};
  virtual ~StreamableSequence(){};
  StreamableSequence(const Sequence& other): Sequence(other){};


  using Sequence::Sequence;
//  using Sequence::~Sequence;
  using Sequence::elems;
  using Sequence::subseqs;
  using Sequence::t;
  using Sequence::copy;
  using Sequence::del;
  using Sequence::from_text;
  using Sequence::get;
  using Sequence::move;
  using Sequence::operator  Service&;
  using Sequence::operator  Service*;
  using Sequence::operator  bool;
  using Sequence::operator  char*;
  using Sequence::operator  double;
  using Sequence::operator  float;
  using Sequence::operator  int;
  using Sequence::operator  long;
  using Sequence::operator  long double;
  using Sequence::operator  long long;
  using Sequence::operator !=;
  using Sequence::operator ();
  using Sequence::operator <<;
  using Sequence::operator =;
  using Sequence::operator ==;
  using Sequence::operator >>;
  using Sequence::operator [];
  using Sequence::operator const char*;
  using Sequence::resize;
  using Sequence::size;
  using Sequence::text;
  using Sequence::to_text;
  using Sequence::type;

  // streamable interface
  void read(StreamInput& si);
  void write(StreamOutput& so) const;
};

#endif	// _STREAMABLESEQUENCE_H
