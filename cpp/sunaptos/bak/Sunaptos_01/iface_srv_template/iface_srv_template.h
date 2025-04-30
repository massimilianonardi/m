#ifndef _IFACE_SRV_TEMPLATE_H
#define	_IFACE_SRV_TEMPLATE_H

#include "iface_template.h"
#include "commandlistener.h"

//todo: creare l'interfaccia iface_srv_listener, poichè il client.exe carica il srv, carica il srv_wrapper(srv) ed è lui
// che gestisce l'ipc pura: quando riceve un msg non lo analizza, ma lo passa alla iface_srv_listener che ne fa lo switch case 
// e richiama il metodo appropriato di srv (pensare a come creare gli ID dei metodi che poi vengono usati nella case: progressivi?).
// è il client che deve gestire quelle cose per motivi di sicurezza, infatti il client è creato una volta per tutti i srv/ifaces
// i wrapper invece li può fare anche l'utente!!!!!
class iface_srv_template: virtual public CommandListener
{
  private:
    iface_template* srv;
    
  public:
    iface_srv_template(iface_template* srv);
    virtual ~iface_srv_template();
    
    Data* processCommand(int cmd, Data* msg);
};

#endif	// _IFACE_SRV_TEMPLATE_H
