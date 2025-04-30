#ifndef _IFACE_CLI_TEMPLATE_H
#define	_IFACE_CLI_TEMPLATE_H

#include "iface_template.h"
#include "commandlistener.h"

class iface_cli_template: virtual public iface_template
{
  private:
    CommandListener* cl;
    
  public:
    iface_cli_template(CommandListener* cl);
    virtual ~iface_cli_template();
    
    Data* method_1(Data* data);
    Data* method_2(Data* data);
    Data* method_3(Data* data);
};

#endif	// _IFACE_CLI_TEMPLATE_H
