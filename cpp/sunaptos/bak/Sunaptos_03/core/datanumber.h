#ifndef _DATANUMBER_H
#define	_DATANUMBER_H

#include "streamable.h"

class DataNumber: virtual public Streamable
{
  protected:
    long num;

  public:
    DataNumber(int n);
    DataNumber(long n);
    DataNumber(float n);
    DataNumber(bool n);
    virtual ~DataNumber();

    void read(StreamInput* si);
    void write(StreamOutput* so);

    int geti();
    long getl();
    float getf();
    bool getb();
};

#endif	// _DATANUMBER_H
