#ifndef _iface_template_H
#define _iface_template_H

#include "object.h"
#include "data.h"

class iface_template: virtual public Object
{
  public:
    virtual ~iface_template(){};
    
    virtual Data* method_1(Data* data) = 0;
    virtual Data* method_2(Data* data) = 0;
    virtual Data* method_3(Data* data) = 0;
};

#endif // _iface_template_H
