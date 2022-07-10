#ifndef _SHAREDMEMORY_H
#define	_SHAREDMEMORY_H

class SharedMemory
{
  protected:
    void* pb;
    long* psz;
    void* pdata;
#ifdef WIN32
    void* mmap;
#elif defined LINUX
    int mmap;
#else
#endif
    void setPointers();

  public:
    SharedMemory();
    SharedMemory(const char* key, long size);
    SharedMemory(const char* key);
    virtual ~SharedMemory();

    bool create(const char* key, long size);
    bool open(const char* key);
    void close();
    long size();
    const void* get();
};

#endif	// _SHAREDMEMORY_H
