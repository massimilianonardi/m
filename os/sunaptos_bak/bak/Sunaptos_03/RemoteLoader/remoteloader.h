#ifndef _REMOTELOADER_H
#define	_REMOTELOADER_H

#include "object.h"
#include "data.h"

class RemoteLoader: virtual public Object
{
  public:
    virtual ~RemoteLoader(){};

    virtual Data* getInterface(Data* data) = 0;
    virtual Data* getService(Data* data) = 0;
};

#endif	// _REMOTELOADER_H
