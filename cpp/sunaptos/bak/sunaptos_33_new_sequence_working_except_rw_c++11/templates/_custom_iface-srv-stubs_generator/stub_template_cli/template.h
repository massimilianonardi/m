#ifndef _template_define_CLI_H
#define	_template_define_CLI_H

#include "template_file_name.h"
#include "commandlistener.h"

class template_class_cli: virtual public template_class
{
  private:
    CommandListener* cl;
    
  public:
    template_class_cli(CommandListener* cl);
    virtual ~template_class_cli();
    
    Sequence& method_1(Sequence& params, Sequence& res);
    Sequence& method_2(Sequence& params, Sequence& res);
    Sequence& method_3(Sequence& params, Sequence& res);
};

#endif	// _template_define_CLI_H
