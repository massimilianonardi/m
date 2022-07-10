#ifndef _template_define_H
#define _template_define_H

#include "object.h"
#include "data.h"

class template_class: virtual public Object
{
  public:
    virtual ~template_class(){};
    
    virtual Data* method_1(Data* data) = 0;
    virtual Data* method_2(Data* data) = 0;
    virtual Data* method_3(Data* data) = 0;
};

#endif // _template_define_H
