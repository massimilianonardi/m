#include "gui.h"
#include <gtk/gtk.h>

Gui::Gui(Service* k)
{
  debug("[Gui::Gui]")
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
}

Gui::~Gui()
{
  debug("[Gui::~Gui]")
  // gui detach from anything sa specific
  stop();
  gtk_main_quit();
}

void Gui::runloop()
{
  gtk_main();
  stop();
}

Sequence Gui::f(number i, Sequence& params)
{
  debug("[Gui::f]")
  debug("[Gui::f] i = " << (long) i << " - params = " << (char*) params)
  Sequence res;
  return res;
}
