#include "output_manager_opengl.h"

SERVICE_EXPORT(output_manager_opengl)

output_manager_opengl::output_manager_opengl(SERVICE_METHOD_PARAMETERS)
{
  start(0);
}

output_manager_opengl::~output_manager_opengl()
{
}

SERVICE_METHOD_DEFINITION(output_manager_opengl, start)
{
  oglw.start();
  
  return sequence();
}

SERVICE_METHOD_DEFINITION(output_manager_opengl, stop)
{
  oglw.stop();
  loader.stop(0);
  
  return sequence();
}

SERVICE_METHOD_DEFINITION(output_manager_opengl, create)
{
  return sequence();
}

SERVICE_METHOD_DEFINITION(output_manager_opengl, destroy)
{
  return sequence();
}
