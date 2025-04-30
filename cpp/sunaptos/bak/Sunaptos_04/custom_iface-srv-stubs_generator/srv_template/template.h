#ifndef _template_define_H
#define	_template_define_H

#include "template_base_class_file_name.h"
#include "loader.h"

class template_class: virtual public template_base_class
{
  public:
    template_class(Loader* loader);
    virtual ~template_class();
    
    Data* method_1(Data* data);
    Data* method_2(Data* data);
    Data* method_3(Data* data);
};

#endif	// _template_define_H
