#ifndef _template_define_H
#define	_template_define_H

#include "template_base_class_file_name.h"
#include "loader.h"

class template_class: virtual public template_base_class
{
  public:
    template_class(Loader* loader);
    virtual ~template_class();
    
    Sequence& method_1(Sequence& params, Sequence& res);
    Sequence& method_2(Sequence& params, Sequence& res);
    Sequence& method_3(Sequence& params, Sequence& res);
};

#endif	// _template_define_H
