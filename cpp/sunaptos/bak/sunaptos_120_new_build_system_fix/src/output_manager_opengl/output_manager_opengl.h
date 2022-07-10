#ifndef OUTPUT_MANAGER_OPENGL_H
#define	OUTPUT_MANAGER_OPENGL_H

#include "sunaptos.h"

#include "OpenGLWindow.h"

class output_manager_opengl: virtual public service
{
protected:
  OpenGLWindow oglw;
  
public:
  output_manager_opengl(SERVICE_METHOD_PARAMETERS);
  virtual ~output_manager_opengl();
  
  SERVICE_METHOD_DECLARATION(start)
  SERVICE_METHOD_DECLARATION(stop)
  SERVICE_METHOD_DECLARATION(create)
  SERVICE_METHOD_DECLARATION(destroy)
//  SERVICE_METHOD_DECLARATION(create_advanced)
//  SERVICE_METHOD_DECLARATION(show)
//  SERVICE_METHOD_DECLARATION(hide)
//  SERVICE_METHOD_DECLARATION(set)
//  SERVICE_METHOD_DECLARATION(move)
};

#endif	/* OUTPUT_MANAGER_OPENGL_H */
