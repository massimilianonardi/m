#ifndef GUI_H
#define	GUI_H

#include "sunaptos.h"

class Gui: virtual public Service,  virtual public Thread
{
public:
  Gui(Service* k);
  ~Gui();

  SERVICE_METHOD_DISPATCHER_DEFINITION
  void runloop();
};

#endif	/* GUI_H */
