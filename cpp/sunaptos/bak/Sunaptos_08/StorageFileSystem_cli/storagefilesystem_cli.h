#ifndef _STORAGEFILESYSTEM_CLI_H
#define	_STORAGEFILESYSTEM_CLI_H

#include "storagefilesystem.h"
#include "commandlistener.h"

class StorageFileSystem_cli: virtual public StorageFileSystem
{
  private:
    CommandListener* cl;
    
  public:
    StorageFileSystem_cli(CommandListener* cl);
    virtual ~StorageFileSystem_cli();
    
    Sequence& filecreate(Sequence& params, Sequence& res);
    Sequence& filedelete(Sequence& params, Sequence& res);
    Sequence& filerename(Sequence& params, Sequence& res);
};

#endif	// _STORAGEFILESYSTEM_CLI_H
