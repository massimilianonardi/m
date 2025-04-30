#ifndef OUTPUT_MANAGER_WINDOW_H
#define	OUTPUT_MANAGER_WINDOW_H

#include "sunaptos.h"

#ifdef WIN32
#include <windows.h>
#elif defined LINUX
#endif

enum class window_type: unsigned char
{
  undefined = 0,
  list = 1,
  tree = 2,
  net = 3,
  custom = 0xFF,
};

class output_manager_window: virtual public service
{
protected:
#ifdef WIN32
  HINSTANCE hInstance;
  WNDCLASS wc;
  ATOM wndClass;
  HWND root_window;
#elif defined LINUX
#endif
  bool active;
  
public:
  output_manager_window(SERVICE_METHOD_PARAMETERS);
  virtual ~output_manager_window();
  
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

#endif	/* OUTPUT_MANAGER_WINDOW_H */
