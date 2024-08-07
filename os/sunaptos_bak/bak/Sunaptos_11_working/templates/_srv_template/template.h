#ifndef _template_define_H
#define	_template_define_H

#include "service.h"
#include "kernel.h"

class template_class: virtual public Service
{
  public:
    template_class(Kernel* k);
    virtual ~template_class();
    
    Sequence& f(number i, Sequence& params, Sequence& res);
};

#endif	// _template_define_H
