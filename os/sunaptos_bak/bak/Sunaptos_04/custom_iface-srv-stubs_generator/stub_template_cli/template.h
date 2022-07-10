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
    
    Data* method_1(Data* data);
    Data* method_2(Data* data);
    Data* method_3(Data* data);
};

#endif	// _template_define_CLI_H
