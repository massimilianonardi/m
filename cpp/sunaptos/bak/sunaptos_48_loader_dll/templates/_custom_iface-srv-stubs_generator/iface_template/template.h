#ifndef _template_define_H
#define _template_define_H

#include "object.h"
#include "sequence.h"

class template_class: virtual public Object
{
  public:
    virtual ~template_class(){};
    
    virtual Sequence& method_1(Sequence& params, Sequence& res) = 0;
    virtual Sequence& method_2(Sequence& params, Sequence& res) = 0;
    virtual Sequence& method_3(Sequence& params, Sequence& res) = 0;
};

#endif // _template_define_H
