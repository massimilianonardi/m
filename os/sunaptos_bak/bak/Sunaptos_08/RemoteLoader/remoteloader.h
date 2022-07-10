#ifndef _REMOTELOADER_H
#define _REMOTELOADER_H

#include "object.h"
#include "sequence.h"

class RemoteLoader: virtual public Object
{
  public:
    virtual ~RemoteLoader(){};
    
    virtual Sequence& getInterface(Sequence& params, Sequence& res) = 0;
    virtual Sequence& getService(Sequence& params, Sequence& res) = 0;
    virtual Sequence& setLoaderListener(Sequence& params, Sequence& res) = 0;
};

#endif // _REMOTELOADER_H
