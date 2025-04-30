#include "gui.h"

#ifdef WIN32
#elif defined LINUX
#include <gtk/gtk.h>
#else
#endif

Gui::Gui(Service* k)
{
  debug("[Gui::Gui]")

#ifdef WIN32
#elif defined LINUX
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
  gtk_main_quit();
#else
#endif
}

void Gui::runloop()
{

#ifdef WIN32
#elif defined LINUX
  gtk_main();
  stop();
#else
#endif
}

sequence Gui::f(element i, sequence& params)
{
  debug("[Gui::f]")
  debug("[Gui::f] i = " << (long) i << " - params = " << (char*) params)
  sequence res;
  return res;
}
