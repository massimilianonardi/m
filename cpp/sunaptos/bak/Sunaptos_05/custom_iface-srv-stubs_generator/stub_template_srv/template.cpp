#include "template_file_name_srv.h"

template_class_srv::template_class_srv(template_class* srv)
{
  this->srv = srv;
  // todo: if this->srv is null throw an exception
}

template_class_srv::~template_class_srv()
{
  // since the "srv" pointer was created outside, then it is appropriate and more robust to be deleted outside either
}

Data* template_class_srv::processCommand(int cmd, Data* msg)
{
  switch(cmd)
  {
    case 1:
      return srv->method_1(msg);
      break;
    case 2:
      return srv->method_2(msg);
      break;
    case 3:
      return srv->method_3(msg);
      break;
    default:
      // throw a "method not found" exception
      break;
  }
  // throw a "method not found" exception
}
