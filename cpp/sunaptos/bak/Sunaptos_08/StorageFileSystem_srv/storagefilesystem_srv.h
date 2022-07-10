#ifndef _STORAGEFILESYSTEM_SRV_H
#define	_STORAGEFILESYSTEM_SRV_H

#include "storagefilesystem.h"
#include "commandlistener.h"

//todo: creare l'interfaccia iface_srv_listener, poichè il client.exe carica il srv, carica il srv_wrapper(srv) ed è lui
// che gestisce l'ipc pura: quando riceve un msg non lo analizza, ma lo passa alla iface_srv_listener che ne fa lo switch case 
// e richiama il metodo appropriato di srv (pensare a come creare gli ID dei metodi che poi vengono usati nella case: progressivi?).
// è il client che deve gestire quelle cose per motivi di sicurezza, infatti il client è creato una volta per tutti i srv/ifaces
// i wrapper invece li può fare anche l'utente!!!!!
class StorageFileSystem_srv: virtual public CommandListener
{
  private:
    StorageFileSystem* srv;
    
  public:
    StorageFileSystem_srv(StorageFileSystem* srv);
    virtual ~StorageFileSystem_srv();
    
    Sequence& processCommand(int cmd, Sequence& params, Sequence& res);
};

#endif	// _STORAGEFILESYSTEM_SRV_H
