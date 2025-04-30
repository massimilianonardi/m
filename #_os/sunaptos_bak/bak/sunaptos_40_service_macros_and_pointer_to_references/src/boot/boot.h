#ifndef BOOT_H
#define	BOOT_H

#include "sunaptos.h"

class Boot: virtual public Service
{
  protected:
    Service* k;

  public:
    Boot(Service* k);
    ~Boot();

    Sequence f(const Sequence& i, const Sequence& params);
};

#endif	/* BOOT_H */
