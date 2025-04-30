#include "iface_srv_template.h"

iface_srv_template::iface_srv_template(iface_template* srv)
{
  this->srv = srv;
  // todo: if this->srv is null throw an exception
}

iface_srv_template::~iface_srv_template()
{
  // since the "srv" pointer was created outside, then it is appropriate and more robust to be deleted outside either
}

Data* iface_srv_template::processCommand(int cmd, Data* msg)
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
