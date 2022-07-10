#ifndef _STREAM_H
#define	_STREAM_H

#include "streaminput.h"
#include "streamoutput.h"

// implementing this interface means that reads/writes are performed on the same stream
// implementing StreamInput and StreamOutput separately do not require that reads/writes
// are related to the same stream
class Stream: virtual public StreamInput, virtual public StreamOutput
{
  public:
    virtual ~Stream(){};

    virtual long size() = 0;
};

class Streamable
{
  public:
    virtual ~Streamable(){};

    virtual void read(StreamInput& si) = 0;
    virtual void write(StreamOutput& so) = 0;
};

StreamInput& operator>>(StreamInput& si, Streamable& e);
StreamOutput& operator<<(StreamOutput& so, Streamable& e);

#endif	// _STREAM_H
