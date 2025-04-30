#include "dynamiclibrarymanager.h"

DynamicLibraryManager::DynamicLibraryManager()
{
}

DynamicLibraryManager::~DynamicLibraryManager()
{
  // todo: destruct all libraries
  // todo: think if all objects should be destroyed
}

Object* DynamicLibraryManager::createobj(const char* name, Loader* loader)
{
  string on = name + string(".dlib");
  DLibObj* dlibo = dlom[on];
  if(dlibo == 0)
  {
    dlibo = new DLibObj(on.c_str());
    dlom[on] = dlibo;
  }

  Object* obj = dlibo->create(loader);

//  objs[id] = obj;

  return obj;
}

Object* DynamicLibraryManager::createcli(const char* name, CommandListener* cl)
{
  string cn = name + string("_cli.dlib");
  DLibCli* dlibc = dlcm[cn];
  if(dlibc == 0)
  {
    dlibc = new DLibCli(cn.c_str());
    dlcm[cn] = dlibc;
  }

  Object* obj = dlibc->create(cl);

//  objscli[key] = obj;

  return obj;
}

CommandListener* DynamicLibraryManager::createsrv(const char* name, Object* obj)
{
  string sn = name + string("_srv.dlib");
  DLibSrv* dlibs = dlsm[sn];
  if(dlibs == 0)
  {
    dlibs = new DLibSrv(sn.c_str());
    dlsm[sn] = dlibs;
  }

  CommandListener* srv = dlibs->create(obj);

//  objssrv[key] = srv;

  return srv;
}
