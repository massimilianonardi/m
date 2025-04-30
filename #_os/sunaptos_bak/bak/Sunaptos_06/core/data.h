#ifndef _DATA_H
#define	_DATA_H

#include "datavector.h"

class Data: virtual public DataVector
{
  public:
    virtual ~Data(){};
};

#endif	// _DATA_H
