#ifndef _SHAREDMEMORYSTREAM_H
#define	_SHAREDMEMORYSTREAM_H

#include "sharedmemory.h"
#include "stream.h"

class SharedMemoryStream: virtual protected SharedMemory, virtual public Stream
{
  protected:
    long posr;
    long posw;

  public:
    SharedMemoryStream();
    virtual ~SharedMemoryStream();

    long size();

    void read(Buffer* buffer);
    long getReadPos();
    void setReadPos(long pos);
    bool bosi();
    bool eosi();

    void write(Buffer* buffer);
    long getWritePos();
    void setWritePos(long pos);
    bool boso();
    bool eoso();
};

#endif	// _SHAREDMEMORYSTREAM_H
