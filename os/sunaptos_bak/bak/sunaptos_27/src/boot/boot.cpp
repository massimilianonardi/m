#include "boot.h"
#include "../test_ifaces/iface_one.h"
#include "../test_ifaces/iface_two.h"
#include "../simple/simple.h"
#include <typeinfo>

Boot::Boot(Service* k)
{
  debug("[Boot::Boot 00]")
  this->k = k;
  debug("[Boot::Boot 99]")
}

Boot::~Boot()
{
  debug("[Boot::~Boot]")
}

sequence Boot::f(element i, sequence& params)
{
  debug("[Boot::f 00]")
  sequence res;

  debug_instruction(std::cout << "debug instruction\n";)

  try_managed
  Service* srv = 0;
//  srv = k->f(Kernel::create, params = sequence("simple"))[0];
//  srv->f(1, params = sequence("simple local"));
//
//  srv = k->f(Kernel::create_separate, params = sequence("simple"))[0];
//  srv->f(2, params = sequence("simple remote"));
//  
//  srv = k->f(Kernel::create_separate, params = sequence("gui"))[0];
  
//  srv = k->f(Kernel::create, params = "storage");
//  res.resize(0);
//  res << "seq1";
//  res << "test text";
//  params = res;
//  srv->f(1, params);
//  debug("[Boot::f 01]" << res.text())
//  params = "seq1";
//  res = srv->f(0, params);
//  debug("[Boot::f 02]" << res.text())
  
//  srv = k->f(Kernel::create, params = "tifs");
//  Simple* sm = reinterpret_cast<Simple*>(srv);
//  iface_one* i1 = sm->iface_one_i();
//  iface_two* i2 = sm->iface_two_i();
////  iface_one* i1 = dynamic_cast<iface_one*>(sm);
////  iface_two* i2 = dynamic_cast<iface_two*>(sm);
////  iface_one* i1 = (iface_one*) srv;
////  iface_two* i2 = (iface_two*) srv;
////  iface_one* i1 = dynamic_cast<iface_one*>(srv);
////  iface_two* i2 = dynamic_cast<iface_two*>(srv);
////  iface_one* i1 = reinterpret_cast<iface_one*>(srv);
////  iface_two* i2 = reinterpret_cast<iface_two*>(srv);
////  debug(typeid(srv).name())
////  debug(typeid(sm).name())
////  debug(typeid(iface_one).name())
////  debug(typeid(iface_two).name())
////  srv = new Simple(k);
//  sm->m_one_1(params = "sm->m_one_1");
//  sm->m_one_2(params = "sm->m_one_2");
//  sm->m_two_1(params = "sm->m_two_1");
//  sm->m_two_2(params = "sm->m_two_2");
//  
//  i1->m_one_1(params = "i1->m_one_1");
//  i1->m_one_2(params = "i1->m_one_2");
//  i2->m_two_1(params = "i2->m_two_1");
//  i2->m_two_2(params = "i2->m_two_2");
//  
//  srv->f(0, params = "srv");
//  i1->f(0, params = "i1");
//  i1->f(1, params = "i1");
//  i2->f(0, params = "i2");
//  i2->f(1, params = "i2");
  
  k->f(Kernel::exit_process, params = sequence(""));
//  o << (long) srv; throw o;
  catch_managed("Boot::f")
  debug("handling exception")
//  rethrow_managed
  exit_try_catch_managed

  debug("[Boot::f 99]")
  return res;
}
