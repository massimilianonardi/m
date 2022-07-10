#ifndef _BUFFERMEMORY_H
#define	_BUFFERMEMORY_H

class BufferMemory
{
  protected:
    int s;
    int pos;
    void* buffer;

  public:
    BufferMemory(int size);
    virtual ~BufferMemory();

    int size();
    void resize(int size) throw (const char*);
    int getpos();
    void setpos(int pos) throw (const char*);
    const void* getbuffer();
};

#endif	// _BUFFERMEMORY_H
