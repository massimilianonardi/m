#ifndef UI_H
#define	UI_H

#include "sunaptos.h"

class ui: virtual public Service
{
  protected:
    Service* k;

  public:
    enum {status = 10000, user_intervention = 10001};

    ui(Service* k);
    ~ui();

    Sequence f(number i, Sequence& params);
};

#endif	/* UI_H */
