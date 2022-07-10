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

    sequence f(sequence& i, sequence& params);

  protected:
    sequence getsequence(sequence& params);
    sequence setsequence(sequence& params);
};

#endif	/* STORAGE_H */
