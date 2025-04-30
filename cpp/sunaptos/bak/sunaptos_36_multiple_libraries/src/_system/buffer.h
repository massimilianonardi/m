#ifndef _BUFFER_H
#define	_BUFFER_H

#include "system.h"

class Buffer
{
  protected:
    long sz;
    void* pb;

  public:
    Buffer();
    Buffer(long size);
    Buffer(const void* pbuf, long size);
    Buffer(const Buffer& b);
    Buffer& operator=(const Buffer& b);
    virtual ~Buffer();

    long size();
    void resize(long size);
    const void* get();
    void set(const void* pbuf, long size);
};

#endif	// _BUFFER_H
