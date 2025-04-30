#ifndef _iface_template_cli_H
#define	_iface_template_cli_H

#include "iface_template.h"
#include "commandlistener.h"

class iface_template_cli: virtual public iface_template
{
  private:
    CommandListener* cl;
    
  public:
    iface_template_cli(CommandListener* cl);
    virtual ~iface_template_cli();
    
    Data* method_1(Data* data);
    Data* method_2(Data* data);
    Data* method_3(Data* data);
};

#endif	// _iface_template_cli_H
