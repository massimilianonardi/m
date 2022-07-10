#include "gui.h"

#ifdef WIN32
#elif defined LINUX
Display* d;
Window w, w2;
XEvent e;
#else
#endif

Gui::Gui(Service* k)
{
  debug("[Gui::Gui]")
#ifdef WIN32
#elif defined LINUX
  d = XOpenDisplay("");
  
  w = XCreateWindow(d, DefaultRootWindow(d), 0, 0, 800, 600, 10, CopyFromParent, InputOutput, CopyFromParent, 0, 0);
  XMapWindow(d, w);
//  Window w2 = XCreateSimpleWindow(d, DefaultRootWindow(d), 0, 0, 400, 300, 10, 255, 255);
  w2 = XCreateSimpleWindow(d, w, 10, 10, 400, 300, 10, 255, 255);
  XMapWindow(d, w2);
  
  XFlush(d);
  
  start();
#else
#endif
}

Gui::~Gui()
{
  debug("[Gui::~Gui]")
  // gui detach from anything sa specific
#ifdef WIN32
#elif defined LINUX
  stop();
  XDestroyWindow(d, w2);
  XDestroyWindow(d, w);
  XCloseDisplay(d);
#else
#endif
}

void Gui::runloop()
{
#ifdef WIN32
#elif defined LINUX
  XNextEvent(d, &e);
  if(e.type == DestroyNotify)
  {
    stop();
  }
#else
#endif
}

sequence Gui::f(sequence& i, sequence& params)
{
  debug("[Gui::f]")
  debug("[Gui::f] i = " << (long) i << " - params = " << (char*) params)
  sequence res;
  res = sequence("");
  return res;
}
