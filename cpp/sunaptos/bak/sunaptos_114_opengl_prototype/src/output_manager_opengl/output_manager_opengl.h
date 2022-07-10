#ifndef OUTPUT_MANAGER_OPENGL_H
#define	OUTPUT_MANAGER_OPENGL_H

#include "sunaptos.h"

#include "OpenGL.h"

#ifdef WIN32
#include <windows.h>
#elif defined LINUX
#endif

#include <gl/gl.h>
#include <gl/glu.h>
#include <gl/glaux.h>

//enum class window_type: unsigned char
//{
//  undefined = 0,
//  list = 1,
//  tree = 2,
//  net = 3,
//  custom = 0xFF,
//};

class output_manager_opengl: virtual public service, virtual protected thread
{
protected:
#ifdef WIN32
  HINSTANCE hInstance;
  WNDCLASS wc;
  ATOM wndClass;
  HWND hWnd;
  HDC hDC;
#elif defined LINUX
#endif
  bool active;
  HGLRC hRC;
  
public:
  OpenGL ogl;
  
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
  
protected:
  void runloop();
GLvoid ReSizeGLScene(GLsizei width, GLsizei height);		// Resize And Initialize The GL Window
int InitGL(GLvoid);										// All Setup For OpenGL Goes Here
int DrawGLScene(GLvoid);									// Here's Where We Do All The Drawing
GLvoid KillGLWindow(GLvoid);								// Properly Kill The Window
BOOL CreateGLWindow(char* title, int width, int height, int bits, bool fullscreenflag);
int WinMain2(	HINSTANCE	hInstance);			// Window Show State
};

#endif	/* OUTPUT_MANAGER_OPENGL_H */
