#ifndef GUI_H
#define	GUI_H

#include "sunaptos.h"

class Gui: virtual public Service,  virtual public Thread
{
public:
  Gui(SERVICE_METHOD_PARAMETERS);
  ~Gui();

  SERVICE_DECLARATIONS
  void runloop();
};

#endif	/* GUI_H */
