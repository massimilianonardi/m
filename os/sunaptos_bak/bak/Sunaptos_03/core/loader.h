#ifndef _LOADER_H
#define	_LOADER_H

class Loader
{
  public:
    virtual ~Loader(){};
    
    virtual Object* getInterface(const char* ifn, const char* sn = 0, bool remote = false) = 0;
    virtual Object* getService(const char* sn, bool remote = false) = 0;
    
    // todo: add a method to delete an active object via the loader
    // todo: add methods to create/delete data objects via the loader
};

#endif	// _LOADER_H
