#ifndef _BUFFER_H
#define	_BUFFER_H

class Buffer
{
  public:
    int size;
    int pos;
    void* buffer;

    Buffer();
    virtual ~Buffer();
};

#endif	// _BUFFER_H
