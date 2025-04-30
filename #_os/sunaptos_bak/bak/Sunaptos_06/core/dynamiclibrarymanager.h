#ifndef _DYNAMICLIBRARYMANAGER_H
#define	_DYNAMICLIBRARYMANAGER_H

#include "object.h"
#include "loader.h"
#include "commandlistener.h"

#include "dlibobj.h"
#include "dlibcli.h"
#include "dlibsrv.h"

#include <map>
#include <string>
using namespace std;

typedef map<string, Object*> ObjectsMap;
typedef map<string, CommandListener*> CommandListenerMap;
typedef map<string, DLibObj*> DLibObjMap;
typedef map<string, DLibCli*> DLibCliMap;
typedef map<string, DLibSrv*> DLibSrvMap;

class DynamicLibraryManager
{
  protected:
    ObjectsMap objs;
    ObjectsMap objscli;
    CommandListenerMap objssrv;
    DLibObjMap dlom;
    DLibCliMap dlcm;
    DLibSrvMap dlsm;

  public:
    DynamicLibraryManager();
    virtual ~DynamicLibraryManager();

    Object* createobj(const char* name, Loader* loader);
    Object* createcli(const char* name, CommandListener* cl);
    CommandListener* createsrv(const char* name, Object* obj);
};

#endif	// _DYNAMICLIBRARYMANAGER_H
