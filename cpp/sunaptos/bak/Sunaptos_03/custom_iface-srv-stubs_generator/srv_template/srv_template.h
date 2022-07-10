#ifndef _srv_template_H
#define	_srv_template_H

#include "iface_template.h"
#include "loader.h"

class srv_template: virtual public iface_template
{
  public:
    srv_template(Loader* loader);
    virtual ~srv_template();
    
    Data* method_1(Data* data);
    Data* method_2(Data* data);
    Data* method_3(Data* data);
};

#endif	// _srv_template_H
