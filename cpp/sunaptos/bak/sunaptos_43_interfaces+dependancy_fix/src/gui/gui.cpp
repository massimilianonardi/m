#include "gui.h"

#ifdef WIN32
#elif defined LINUX
// X11
#include <X11/Xlib.h>

Display* d;
Window w, w2;
XEvent e;

// GTK
#include <gtk/gtk.h>
#else
#endif

Gui::Gui(Service* k)
{
  debug("[Gui::Gui]")

#ifdef WIN32
#elif defined LINUX
// X11
  d = XOpenDisplay("");
  
  w = XCreateWindow(d, DefaultRootWindow(d), 0, 0, 800, 600, 10, CopyFromParent, InputOutput, CopyFromParent, 0, 0);
  XMapWindow(d, w);
//  Window w2 = XCreateSimpleWindow(d, DefaultRootWindow(d), 0, 0, 400, 300, 10, 255, 255);
  w2 = XCreateSimpleWindow(d, w, 10, 10, 400, 300, 10, 255, 255);
  XMapWindow(d, w2);
  
  XFlush(d);

// GTK
  gtk_init(0, 0);
  GtkWidget* window;
  window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
  gtk_window_set_position(GTK_WINDOW(window), GTK_WIN_POS_CENTER);
  gtk_window_set_default_size(GTK_WINDOW(window), 200, 100);
  gtk_window_set_title(GTK_WINDOW(window), "gtkapp");
  gtk_widget_show(window);
  g_signal_connect(window, "destroy", G_CALLBACK (gtk_main_quit), NULL);
  
  GtkWidget* button;
  button = gtk_button_new_with_label("Hello World");
  g_signal_connect_swapped (button, "clicked", G_CALLBACK (gtk_widget_destroy), window);
#else
#endif
  
  Thread::start();
}

Gui::~Gui()
{
  debug("[Gui::~Gui]")
  Thread::stop();

#ifdef WIN32
#elif defined LINUX
// X11
  XDestroyWindow(d, w2);
  XDestroyWindow(d, w);
  XCloseDisplay(d);

// GTK
  gtk_main_quit();
#else
#endif
}

void Gui::runloop()
{

#ifdef WIN32
#elif defined LINUX
// X11
  XNextEvent(d, &e);
  if(e.type == DestroyNotify)
  {
    stop();
  }

// GTK
  gtk_main();
  stop();
#else
#endif
}

SERVICE_REGISTER(Gui)
SERVICE_REGISTER_END
