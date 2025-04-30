#ifndef _SHAREDMEMORYSTREAM_H
#define	_SHAREDMEMORYSTREAM_H

#include "sharedmemory.h"
#include "stream.h"
#include "lock.h"
#include "Buffer.h"

class SharedMemoryStream: virtual protected SharedMemory, virtual public Stream
{
protected:
  long poslr;
  long poslw;
  long* posr;
  long* posw;
  char* ps;
  Lock lr;
  Lock lw;

public:
  SharedMemoryStream(const char* key, long size);
  SharedMemoryStream(const char* key);
  virtual ~SharedMemoryStream();

  long size();

  void read(Buffer& buffer);
  long getReadPos();
  void setReadPos(long pos);
  bool bosi();
  bool eosi();

  void write(const Buffer& buffer);
  long getWritePos();
  void setWritePos(long pos);
  bool boso();
  bool eoso();
};

#endif	// _SHAREDMEMORYSTREAM_H
