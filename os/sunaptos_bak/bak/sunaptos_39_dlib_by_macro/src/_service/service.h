#ifndef SERVICE_H
#define	SERVICE_H

#include "object.h"
#include "number.h"
#include "sequence.h"

class Service: virtual public Object
{
  public:
//  protected:
    // todo: make destructor protected and make the destroying class friend of service
    virtual ~Service(){};

  public:
    // check if needs to switch to model "Sequence& res = function(Sequence& params, Sequence& res)"
    // create operators helpers for the model "Sequence& res = function(Sequence& params, Sequence& res)"
    // es. res = srv * params ...if makes sense...
    // otherwise res can standardized as part of params, thus if it is not provided function creates a temporary object for it...
//    virtual Sequence& function(Sequence& params) = 0;
//    virtual Sequence& streamIn(Sequence& params) = 0;
//    virtual Sequence& streamOut(Sequence& params) = 0;
//    virtual Sequence& status(Sequence& params) = 0;
//    virtual Sequence& intervention(Sequence& params) = 0;

    // universal method! i can be an index of a seq where the srv has stored all its method pointers!!!
    virtual Sequence& f(number i, Sequence& params, Sequence& res); // can be reimplemented for performance-critical services
    virtual Sequence f(number i, Sequence& params) = 0;
//    virtual Sequence& f(number i, Sequence& params, Sequence& res) = 0;
//    virtual Sequence f(number i, Sequence& params);
};

#endif	/* SERVICE_H */

