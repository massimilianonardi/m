#ifndef _servicestarter_CLI_H
#define	_servicestarter_CLI_H

#include "servicestarter.h"
#include "commandlistener.h"

class ServiceStarter_cli: virtual public ServiceStarter
{
  private:
    CommandListener* cl;
    
  public:
    ServiceStarter_cli(CommandListener* cl);
    virtual ~ServiceStarter_cli();
    
    Data* createServiceChannel(Data* data);
};

#endif	// _servicestarter_CLI_H
