#ifndef _STREAMABLE_H
#define	_STREAMABLE_H

#include "streaminput.h"
#include "streamoutput.h"

class Streamable
{
  public:
    virtual ~Streamable(){};

    virtual void read(StreamInput* si) = 0;
    virtual void write(StreamOutput* so) = 0;

//    virtual Number type() = 0; // returns type/encoding of how values are stored (eg ieee floating point, unicode, etc.)
//    virtual Number size() = 0; // for numbers it returns the value of wide, for text the number of characters
//    virtual Number wide() = 0; // number of bytes used to store values/characters
//
//    virtual Text text() = 0; // human readable representation of the object
};

#endif	// _STREAMABLE_H
