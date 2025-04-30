#ifndef _STREAMINPUT_H
#define	_STREAMINPUT_H

#include "buffer.h"

class StreamInput
{
  public:
    virtual ~StreamInput(){};

    virtual Buffer* read(long size) = 0;
};

#endif	// _STREAMINPUT_H
