#ifndef _DLIBCLI_H
#define	_DLIBCLI_H

#include "dynamiclibraryloader.h"
#include "object.h"
#include "commandlistener.h"

class DLibCli: public DynamicLibraryLoader
{
  public:
    DLibCli(const char* name) throw (const char*);
    
    Object* create(CommandListener* cl) throw (const char*);
};

#endif	// _DLIBCLI_H
