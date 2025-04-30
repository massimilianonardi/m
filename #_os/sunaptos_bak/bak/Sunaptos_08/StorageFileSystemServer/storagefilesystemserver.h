#ifndef _STORAGEFILESYSTEMSERVER_H
#define	_STORAGEFILESYSTEMSERVER_H

#include "storagefilesystem.h"
#include "loader.h"

class StorageFileSystemServer: virtual public StorageFileSystem
{
  protected:
    Sequence rootdir;

  public:
    StorageFileSystemServer(Loader* loader);
    virtual ~StorageFileSystemServer();
    
    Sequence& filecreate(Sequence& params, Sequence& res);
    Sequence& filedelete(Sequence& params, Sequence& res);
    Sequence& filerename(Sequence& params, Sequence& res);

    Sequence& setrootdir(Sequence& params, Sequence& res);
};

#endif	// _STORAGEFILESYSTEMSERVER_H
