#ifndef _SEQUENCE_H
#define	_SEQUENCE_H

#include "streamable.h"
#include "number.h"

class Sequence: virtual public Streamable
{
  protected:
    void* pb;
    number sz;

  public:
    Sequence();
    virtual ~Sequence();

    void read(StreamInput* si);
    void write(StreamOutput* so);

    number size();
    void resize(number size);
//    void reserve(number size);

    Sequence& operator=(const Sequence& seq);
};

#endif	// _SEQUENCE_H
