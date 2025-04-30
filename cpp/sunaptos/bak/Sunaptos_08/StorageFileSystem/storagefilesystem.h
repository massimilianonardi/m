#ifndef _STORAGEFILESYSTEM_H
#define _STORAGEFILESYSTEM_H

#include "object.h"
#include "sequence.h"

class StorageFileSystem: virtual public Object
{
  public:
    virtual ~StorageFileSystem(){};
    
    virtual Sequence& filecreate(Sequence& params, Sequence& res) = 0;
    virtual Sequence& filedelete(Sequence& params, Sequence& res) = 0;
    virtual Sequence& filerename(Sequence& params, Sequence& res) = 0;
};

#endif // _STORAGEFILESYSTEM_H
