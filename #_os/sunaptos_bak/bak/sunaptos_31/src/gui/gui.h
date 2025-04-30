#ifndef GUI_H
#define	GUI_H

#include "sunaptos.h"

class Gui: virtual public Service,  virtual public Thread
{
  public:
    Gui(Service* k);
    ~Gui();

    sequence f(sequence& i, sequence& params);
    void runloop();
};

#endif	/* GUI_H */
