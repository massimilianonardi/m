#ifndef STORAGE_H
#define	STORAGE_H

#include "sunaptos.h"

class Storage: virtual public Service
{
  public:
    enum {get = 0, set = 1};
    
  public:
    Storage(Service* k);
    ~Storage();

    Sequence f(number i, Sequence& params);

  protected:
    Sequence getSequence(Sequence& params);
    Sequence setSequence(Sequence& params);
};

#endif	/* STORAGE_H */
