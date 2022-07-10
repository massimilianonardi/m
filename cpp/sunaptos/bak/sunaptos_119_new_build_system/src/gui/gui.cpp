#include "gui.h"

SERVICE_EXPORT(gui)

gui::gui(SERVICE_METHOD_PARAMETERS)
{
//  input = sequence("input", 0);
//  input->subscribe(sequence().links_ins(this).links_ins(sequence().links_ins(-1).links_ins(-1).links_ins(-1)));
//  output = sequence("window_manager_sdl", 0);
  sequence wm = sequence("output_manager_window", 0);
}

gui::~gui()
{
}

SERVICE_METHOD_DEFINITION(gui, write)
{
  //todo log event
  debug_line
  debug(params.to_string())
  
  return sequence();
}
