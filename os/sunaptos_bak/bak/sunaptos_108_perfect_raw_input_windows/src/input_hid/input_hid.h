#ifndef INPUT_HID_H
#define	INPUT_HID_H

#include "sunaptos.h"

#ifdef WIN32
#include <windows.h>
#elif defined LINUX
#endif

class input_hid: virtual public stream, virtual protected thread
{
protected:
#ifdef WIN32
  HINSTANCE hInstance;
  WNDCLASS wc;
  ATOM wndClass;
  HWND hWnd;
#elif defined LINUX
#endif
  sequence devices;
public:
  input_hid(SERVICE_METHOD_PARAMETERS);
  virtual ~input_hid();
  
//  SERVICE_METHOD_DECLARATION(start)
//  SERVICE_METHOD_DECLARATION(stop)
  SERVICE_METHOD_DECLARATION(get)
  SERVICE_METHOD_DECLARATION(set)
  
  void runloop();
};

#endif	/* INPUT_HID_H */
