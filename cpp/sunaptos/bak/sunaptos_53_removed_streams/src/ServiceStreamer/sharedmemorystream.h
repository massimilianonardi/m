#ifndef _SHAREDMEMORYSTREAM_H
#define	_SHAREDMEMORYSTREAM_H

#include "sharedmemory.h"
#include "service.h"
#include "sequence.h"
#include "lock.h"
#include "Buffer.h"

class SharedMemoryStream: virtual protected SharedMemory, virtual public Sequence//, virtual public Service
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
  SharedMemoryStream(SERVICE_METHOD_PARAMETERS);
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

//  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(read)
  SERVICE_METHOD_DECLARATION(write)
};

#endif	// _SHAREDMEMORYSTREAM_H
