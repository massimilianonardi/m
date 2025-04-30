#ifndef INPUT_H
#define	INPUT_H

#include "sunaptos.h"

#ifdef WIN32
#include <windows.h>
#elif defined LINUX
#endif

class input: virtual public service
{
protected:
#ifdef WIN32
  HINSTANCE hInstance;
  ATOM wndClass;
  HWND hWnd;
#elif defined LINUX
#endif
  sequence devices;
public:
  input(SERVICE_METHOD_PARAMETERS);
  virtual ~input();
  
  SERVICE_DECLARATIONS
  SERVICE_METHOD_DECLARATION(start)
  SERVICE_METHOD_DECLARATION(stop)
  SERVICE_METHOD_DECLARATION(get)
  SERVICE_METHOD_DECLARATION(set)
};

#endif	/* INPUT_H */
