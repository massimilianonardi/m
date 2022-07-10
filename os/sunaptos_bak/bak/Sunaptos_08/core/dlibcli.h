#ifndef _DLIBCLI_H
#define	_DLIBCLI_H

#include "dynamiclibraryloader.h"
#include "object.h"
#include "commandlistener.h"

class DLibCli: public DynamicLibraryLoader
{
  public:
    DLibCli(const char* name);
    virtual ~DLibCli();
    
    Object* create(CommandListener* cl);
};

#endif	// _DLIBCLI_H
