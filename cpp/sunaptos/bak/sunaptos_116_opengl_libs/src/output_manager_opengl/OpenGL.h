#ifndef OPENGL_H
#define	OPENGL_H

#include "sunaptos.h"

#include <gl/gl.h>
#include <gl/glu.h>
#include <gl/glaux.h>

class OpenGL
{
public:
  OpenGL();
  virtual ~OpenGL();
  
  void init();
  void end();
  void resize(int x, int y);
  void draw();
};

#endif	/* OPENGL_H */
