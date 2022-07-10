#ifndef OPENGL_H
#define	OPENGL_H

#include "sunaptos.h"

#include <gl/gl.h>
#include <gl/glu.h>
#include <gl/glaux.h>

class OpenGL: virtual public thread
{
public:
  OpenGL();
  virtual ~OpenGL();
  
protected:
  void runloop();
};

#endif	/* OPENGL_H */
