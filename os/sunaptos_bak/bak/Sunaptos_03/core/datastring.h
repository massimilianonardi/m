#ifndef _DATASTRING_H
#define	_DATASTRING_H

#include "streamable.h"

#include <string>

class DataString: virtual public Streamable
{
  protected:
    std::string s;

  public:
    DataString(const char* c);
    virtual ~DataString();

    void read(StreamInput* si);
    void write(StreamOutput* so);

    unsigned long size();
    void put(const char* c);
    const char* get();
};

#endif	// _DATASTRING_H
