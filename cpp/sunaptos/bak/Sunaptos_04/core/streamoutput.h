#ifndef _STREAMOUTPUT_H
#define	_STREAMOUTPUT_H

#include "buffer.h"

class StreamOutput
{
  public:
    virtual ~StreamOutput(){};

    virtual void write(Buffer* buffer) = 0;
};

#endif	// _STREAMOUTPUT_H
