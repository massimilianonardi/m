#ifndef _STORAGE_H
#define _STORAGE_H

#include "object.h"
#include "sequence.h"

class Storage: virtual public Object
{
  public:
    virtual ~Storage(){};
    
    virtual Sequence& storagesequencespace(Sequence& params, Sequence& res) = 0;
    virtual Sequence& storagesequence(Sequence& params, Sequence& res) = 0;
    virtual Sequence& create(Sequence& params, Sequence& res) = 0;
    virtual Sequence& modify(Sequence& params, Sequence& res) = 0;
    virtual Sequence& get(Sequence& params, Sequence& res) = 0;
    virtual Sequence& set(Sequence& params, Sequence& res) = 0;
    virtual Sequence& ins(Sequence& params, Sequence& res) = 0;
    virtual Sequence& del(Sequence& params, Sequence& res) = 0;
};

#endif // _STORAGE_H
