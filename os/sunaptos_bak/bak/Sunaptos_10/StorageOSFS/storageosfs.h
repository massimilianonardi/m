#ifndef _STORAGEOSFS_H
#define	_STORAGEOSFS_H

#include "storage.h"
#include "loader.h"

class StorageOSFS: virtual public Storage
{
  protected:
    Sequence rootdir;
    Sequence idrules;
    Sequence iddstructs;
    Sequence iddstructsrules;

  public:
    StorageOSFS(Loader* loader);
    virtual ~StorageOSFS();
    
    Sequence& storagesequencespace(Sequence& params, Sequence& res);
    Sequence& storagesequence(Sequence& params, Sequence& res);
    Sequence& create(Sequence& params, Sequence& res);
    Sequence& modify(Sequence& params, Sequence& res);
    Sequence& get(Sequence& params, Sequence& res);
    Sequence& set(Sequence& params, Sequence& res);
    Sequence& ins(Sequence& params, Sequence& res);
    Sequence& del(Sequence& params, Sequence& res);

    void flush();
};

#endif	// _STORAGEOSFS_H
