#ifndef _DATAVECTOR_H
#define	_DATAVECTOR_H

#include "streamable.h"
#include "datanumber.h"
#include "datastring.h"

#include <vector>

class DataVector: virtual public Streamable
{
  protected:
    std::vector<Streamable*> v;

  public:
    DataVector();
    virtual ~DataVector();

    void read(StreamInput* si);
    void write(StreamOutput* so);

    Number type();
    Number size();
    Number wide();

    Text text();

//    long size();
    void put(Streamable* data);
    void put(Streamable* data, int i);
    Streamable* get(int i);
    DataNumber* getn(int i) throw (const char*);
    DataString* gets(int i) throw (const char*);
    DataVector* getv(int i) throw (const char*);
    void del(); // delete all pointers inside the vector
    void del(int i);
};

#endif	// _DATAVECTOR_H
