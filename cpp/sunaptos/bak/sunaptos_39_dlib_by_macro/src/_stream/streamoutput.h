#ifndef _STREAMOUTPUT_H
#define	_STREAMOUTPUT_H

#include "buffer.h"
#include "number.h"

class StreamOutput
{
  public:
    virtual ~StreamOutput(){};

    // write is blocking until data is written or eos, exception is thrown if wrote less bytes than requested
    virtual void write(Buffer& buffer) = 0;
    virtual long getWritePos() = 0;
    virtual void setWritePos(long pos) = 0;
    virtual bool boso() = 0;
    virtual bool eoso() = 0;

    // returns -1 if size is not determinable
    // on dynamic streams (eg sockets) it is always the number of written bytes
    virtual long size() = 0;
    
    StreamOutput& operator<<(number e);
    StreamOutput& operator<<(Buffer& b);
};

#endif	// _STREAMOUTPUT_H
