#include "input.h"

SERVICE_REGISTER(input)
SERVICE_REGISTER_END

input::input(SERVICE_METHOD_PARAMETERS)
{
  // todo load in-dev at startup according to config (usually none, or just input_hid)
  sequence input_hid = sequence("input_hid", 0);
  devices.links_ins(&input_hid);
  input_hid->subscribe(sequence().links_ins(this));
}

input::~input()
{
}

//SERVICE_METHOD_DEFINITION(input, start)
//{
//  // todo restart specific in-dev
//}
//
//SERVICE_METHOD_DEFINITION(input, stop)
//{
//  // todo stops specific in-dev
//}
//
SERVICE_METHOD_DEFINITION(input, subscribe)
{
  ostreams.links_ins(params);
  
  // todo find in-dev to eventually load
  // from subscriber's ptr, get from policy manager or config the proper in-dev to load
  // policy manager gets subscriber's srv name from its pointer by means of loader
  // config or policy manager give default list for certain type, or a specific list for a specific subscriber
  // NB client name is retrieved from loader by srv ptr, to avoid that some srv could pass a fake name to have privileged mappings
  
  return sequence();
}

SERVICE_METHOD_DEFINITION(input, unsubscribe)
{
  // todo
}
//
//SERVICE_METHOD_DEFINITION(input, available)
//{
//  // todo
//}
//
//SERVICE_METHOD_DEFINITION(input, read)
//{
//  // todo
//}

SERVICE_METHOD_DEFINITION(input, write)
{
  for(int i = 0; i < ostreams.links_size(); i++)
  {
    if(check(ostreams(i)(1), params))
    {
      ostreams(i)(0)->write(params);
    }
  }
  
  return sequence();
}

bool input::check(const sequence& filter, const sequence& params)
{
  bool res = true;
  
  sequence nofilter = -1;
  if(filter(0) != nofilter)
  {
    if(filter(0) != params(0))
    {
      res = false;
    }
  }
  if(filter(1) != nofilter)
  {
    if(filter(1) != params(1))
    {
      res = false;
    }
  }
  if(filter(2) != nofilter)
  {
    if(filter(2) != params(2))
    {
      res = false;
    }
  }
  
  return res;
}
