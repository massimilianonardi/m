#ifndef _FILESTREAM_H
#define	_FILESTREAM_H

#include "stream.h"

#include <stdio.h>

class FileStream: virtual public Stream
{
  protected:
    FILE* file;

  public:
    FileStream(const char* name);
    virtual ~FileStream();

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

    static void create(const char* name);
};

#endif	// _FILESTREAM_H
