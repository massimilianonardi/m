#ifndef OPENGLWINDOW_H
#define	OPENGLWINDOW_H

#include "sunaptos.h"

#include "OpenGL.h"

#ifdef WIN32
#include <windows.h>
#elif defined LINUX
#endif

#define OPENGL_WINDOW_CLASS_NAME "opengl_class"

class OpenGLWindow: virtual public thread
{
protected:
#ifdef WIN32
  HINSTANCE hInstance;
  ATOM hWC;
  HWND hWnd;
  HDC hDC;
  HGLRC hRC;
#elif defined LINUX
#endif
//  bool pause;
  bool full_screen;
  
public:
  OpenGL ogl;
  
public:
  OpenGLWindow();
  virtual ~OpenGLWindow();
  
protected:
  void runloop();
  void window_class_register();
  void window_class_unregister();
  void window_create();
  void window_destroy();
};

#endif	/* OPENGLWINDOW_H */
