#ifndef _SERVICESTARTER_CLI_H
#define	_SERVICESTARTER_CLI_H

#include "servicestarter.h"
#include "commandlistener.h"

class ServiceStarter_cli: virtual public ServiceStarter
{
  private:
    CommandListener* cl;
    
  public:
    ServiceStarter_cli(CommandListener* cl);
    virtual ~ServiceStarter_cli();
    
    Sequence& method_1(Sequence& params, Sequence& res);
    Sequence& method_2(Sequence& params, Sequence& res);
    Sequence& method_3(Sequence& params, Sequence& res);
};

#endif	// _SERVICESTARTER_CLI_H
