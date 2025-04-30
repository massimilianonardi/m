#ifndef SERVICE_H
#define	SERVICE_H

#include "object.h"
#include "sequence.h"

class Service: virtual public Object
{
  public:
//  protected:
    // todo: make destructor protected and make the destroying class friend of service
    virtual ~Service(){};

  public:
    // check if needs to switch to model "sequence& res = function(sequence& params, sequence& res)"
    // create operators helpers for the model "sequence& res = function(sequence& params, sequence& res)"
    // es. res = srv * params ...if makes sense...
    // otherwise res can standardized as part of params, thus if it is not provided function creates a temporary object for it...
//    virtual sequence& function(sequence& params) = 0;
//    virtual sequence& streamIn(sequence& params) = 0;
//    virtual sequence& streamOut(sequence& params) = 0;
//    virtual sequence& status(sequence& params) = 0;
//    virtual sequence& intervention(sequence& params) = 0;

    // universal method! i can be an index of a seq where the srv has stored all its method pointers!!!
    virtual sequence& f(element i, sequence& params, sequence& res); // can be reimplemented for performance-critical services
    virtual sequence f(element i, sequence& params) = 0;
//    virtual sequence& f(element i, sequence& params, sequence& res) = 0;
//    virtual sequence f(element i, sequence& params);
};

#endif	/* SERVICE_H */

