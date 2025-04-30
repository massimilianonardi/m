#ifndef _STORAGE_CLI_H
#define	_STORAGE_CLI_H

#include "storage.h"
#include "commandlistener.h"

class Storage_cli: virtual public Storage
{
  private:
    CommandListener* cl;
    
  public:
    Storage_cli(CommandListener* cl);
    virtual ~Storage_cli();
    
    Sequence& storagesequencespace(Sequence& params, Sequence& res);
    Sequence& storagesequence(Sequence& params, Sequence& res);
    Sequence& create(Sequence& params, Sequence& res);
    Sequence& modify(Sequence& params, Sequence& res);
    Sequence& get(Sequence& params, Sequence& res);
    Sequence& set(Sequence& params, Sequence& res);
    Sequence& ins(Sequence& params, Sequence& res);
    Sequence& del(Sequence& params, Sequence& res);
};

#endif	// _STORAGE_CLI_H
