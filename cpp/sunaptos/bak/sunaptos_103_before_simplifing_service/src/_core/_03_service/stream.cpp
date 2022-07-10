#include "stream.h"

//SERVICE_DISPATCHER(stream)
//SERVICE_INTERFACES_REGISTER_DISPATCH
//SERVICE_DISPATCHER_END

stream::~stream()
{
}

SERVICE_METHOD_DEFINITION(stream, subscribe)
{
  ostreams.links_ins(params);
  
  return sequence();
}

SERVICE_METHOD_DEFINITION(stream, unsubscribe)
{
  for(int i = 0; i < ostreams.links_size(); i++)
  {
    if(ostreams(i) == params)
    {
      ostreams.links_del(i);
    }
  }
  
  return sequence();
}

SERVICE_METHOD_DEFINITION(stream, write)
{
  for(int i = 0; i < ostreams.links_size(); i++)
  {
    ostreams(i)(0)->write(params);
  }
  
  return sequence();
}
