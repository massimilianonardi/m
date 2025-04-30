#ifndef _SHAREDMEMORY_H
#define	_SHAREDMEMORY_H

#include "streaminput.h"
#include "streamoutput.h"

#include <windows.h>

class SharedMemory: virtual public StreamInput, virtual public StreamOutput
{
  public:
    int* cmd;

  protected:
    long s;
    long posr;
    long posw;
    void* buf;
    int* version;
    bool* r;
    bool* w;
    long* n;
    void* data;

    void setpointers();
#ifdef WIN32
    void* mmap;
#elif defined LINUX
  // todo: linux code
#else
#endif

  public:
    SharedMemory();
    virtual ~SharedMemory();

    void read(Buffer* buffer);
    void write(Buffer* buffer);

    void create(const char* key, long size);
    void open(const char* key);
    long size();
    void set(bool read, bool write);
    void wait(bool read, bool write);
    void close();
};

#endif	// _SHAREDMEMORY_H
