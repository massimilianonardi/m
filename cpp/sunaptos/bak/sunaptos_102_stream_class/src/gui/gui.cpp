#include "gui.h"

SERVICE_REGISTER(gui)
SERVICE_REGISTER_END

gui::gui(SERVICE_METHOD_PARAMETERS)
{
  input = sequence("input", 0);
  input->subscribe(sequence().links_ins(this).links_ins(sequence().links_ins(-1).links_ins(-1).links_ins(-1)));
//  output = sequence("window_manager_sdl", 0);
}

gui::~gui()
{
}

//SERVICE_METHOD_DEFINITION(gui, start)
//{
//  return sequence();
//}
//
//SERVICE_METHOD_DEFINITION(gui, stop)
//{
//  return sequence();
//}
//
//SERVICE_METHOD_DEFINITION(gui, subscribe)
//{
//  return sequence();
//}
//
//SERVICE_METHOD_DEFINITION(gui, unsubscribe)
//{
//  return sequence();
//}
//
//SERVICE_METHOD_DEFINITION(gui, available)
//{
//  return sequence();
//}
//
//SERVICE_METHOD_DEFINITION(gui, read)
//{
//  return sequence();
//}

//SERVICE_METHOD_DEFINITION(gui, write)
//{
//  //todo log event
//  debug_line
//  
//  return sequence();
//}
