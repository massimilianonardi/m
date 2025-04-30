#ifndef _LOADER_H
#define	_LOADER_H

class Loader
{
  public:
    virtual ~Loader(){};
    
    virtual Object* getInterface(const char* name) = 0;
    virtual Object* getInterface(const char* name, const char* srv) = 0;
    virtual Object* getService(const char* name) = 0;
    virtual Object* getInterfaceRemote(const char* name) = 0;
    virtual Object* getInterfaceRemote(const char* name, const char* srv) = 0;
    virtual Object* getServiceRemote(const char* name) = 0;
};

#endif	// _LOADER_H
