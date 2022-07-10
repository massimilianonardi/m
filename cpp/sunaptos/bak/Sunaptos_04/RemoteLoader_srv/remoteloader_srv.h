#ifndef _REMOTELOADER_SRV_H
#define	_REMOTELOADER_SRV_H

#include "remoteloader.h"
#include "commandlistener.h"

//todo: creare l'interfaccia iface_srv_listener, poich� il client.exe carica il srv, carica il srv_wrapper(srv) ed � lui
// che gestisce l'ipc pura: quando riceve un msg non lo analizza, ma lo passa alla iface_srv_listener che ne fa lo switch case 
// e richiama il metodo appropriato di srv (pensare a come creare gli ID dei metodi che poi vengono usati nella case: progressivi?).
// � il client che deve gestire quelle cose per motivi di sicurezza, infatti il client � creato una volta per tutti i srv/ifaces
// i wrapper invece li pu� fare anche l'utente!!!!!
class RemoteLoader_srv: virtual public CommandListener
{
  private:
    RemoteLoader* srv;
    
  public:
    RemoteLoader_srv(RemoteLoader* srv);
    virtual ~RemoteLoader_srv();
    
    Data* processCommand(int cmd, Data* msg);
};

#endif	// _REMOTELOADER_SRV_H
