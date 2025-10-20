#ifndef _iface_template_srv_H
#define	_iface_template_srv_H

#include "iface_template.h"
#include "commandlistener.h"

//todo: creare l'interfaccia iface_srv_listener, poich� il client.exe carica il srv, carica il srv_wrapper(srv) ed � lui
// che gestisce l'ipc pura: quando riceve un msg non lo analizza, ma lo passa alla iface_srv_listener che ne fa lo switch case 
// e richiama il metodo appropriato di srv (pensare a come creare gli ID dei metodi che poi vengono usati nella case: progressivi?).
// � il client che deve gestire quelle cose per motivi di sicurezza, infatti il client � creato una volta per tutti i srv/ifaces
// i wrapper invece li pu� fare anche l'utente!!!!!
class iface_template_srv: virtual public CommandListener
{
  private:
    iface_template* srv;
    
  public:
    iface_template_srv(iface_template* srv);
    virtual ~iface_template_srv();
    
    Data* processCommand(int cmd, Data* msg);
};

#endif	// _iface_template_srv_H
