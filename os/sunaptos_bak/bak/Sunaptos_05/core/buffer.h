#ifndef _BUFFER_H
#define	_BUFFER_H

class Buffer
{
  protected:
    long sz;
//    void* pb;
    char* pb;

  public:

    Buffer();
    Buffer(long size);
    Buffer(const void* pbuf, long size);
    virtual ~Buffer();

    long size();
    void resize(long size);
    const void* get();
    void set(const void* pbuf, long size);
};

#endif	// _BUFFER_H
