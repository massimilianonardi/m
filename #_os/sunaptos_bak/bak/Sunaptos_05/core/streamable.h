#ifndef _STREAMABLE_H
#define	_STREAMABLE_H

#include "streaminput.h"
#include "streamoutput.h"

class Streamable
{
  public:
    virtual ~Streamable(){};

    virtual void read(StreamInput* si) = 0;
    virtual void write(StreamOutput* so) = 0;
};

#endif	// _STREAMABLE_H
