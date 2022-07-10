#ifndef _STREAMINPUT_H
#define	_STREAMINPUT_H

#include "Buffer.h"
//#include "number.h"

class StreamInput
{
public:
  virtual ~StreamInput(){};

  // read is blocking until data is available or eos, exception is thrown if read/available less bytes than requested
  virtual void read(Buffer& buffer) = 0;
  // on dynamic streams (eg sockets) it is always 0
  virtual long getReadPos() = 0;
  // on dynamic streams (eg sockets) skips and discards "pos" bytes
  virtual void setReadPos(long pos) = 0;
  // on dynamic streams (eg sockets) it is always true
  virtual bool bosi() = 0;
  // on dynamic streams (eg sockets) it is always 0
  virtual bool eosi() = 0;

  // returns -1 if size is not determinable
  // on dynamic streams (eg sockets) it is always the number of available bytes
  virtual long size() = 0;

//    StreamInput& operator>>(number& e);
  StreamInput& operator>>(Buffer& b);
};

#endif	// _STREAMINPUT_H
