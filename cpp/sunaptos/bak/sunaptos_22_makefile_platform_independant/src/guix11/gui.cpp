#include "gui.h"
#include <X11/Xlib.h>

Display* d;
Window w, w2;
XEvent e;

Gui::Gui(Service* k)
{
  debug("[Gui::Gui]")
  d = XOpenDisplay("");
  
  w = XCreateWindow(d, DefaultRootWindow(d), 0, 0, 800, 600, 10, CopyFromParent, InputOutput, CopyFromParent, 0, 0);
  XMapWindow(d, w);
//  Window w2 = XCreateSimpleWindow(d, DefaultRootWindow(d), 0, 0, 400, 300, 10, 255, 255);
  w2 = XCreateSimpleWindow(d, w, 10, 10, 400, 300, 10, 255, 255);
  XMapWindow(d, w2);
  
  XFlush(d);
  
  start();
}

Gui::~Gui()
{
  debug("[Gui::~Gui]")
  // gui detach from anything sa specific
  stop();
  XDestroyWindow(d, w2);
  XDestroyWindow(d, w);
  XCloseDisplay(d);
}

void Gui::runloop()
{
  XNextEvent(d, &e);
  if(e.type == DestroyNotify)
  {
    stop();
  }
}

Sequence Gui::f(number i, Sequence& params)
{
  debug("[Gui::f]")
  debug("[Gui::f] i = " << (long) i << " - params = " << (char*) params)
  Sequence res;
  return res;
}
