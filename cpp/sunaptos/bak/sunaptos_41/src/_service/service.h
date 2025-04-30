#ifndef SERVICE_H
#define	SERVICE_H

// export static method names, or predefined enums, or defines
// declare macros
// define macros
// initialize sequence mapping names to method pointers

// calling f pass i = method pointer -> no, because is compiler specific

#define SERVICE_METHOD_DISPATCHER_DEFINITION \
Sequence f(const Sequence& method, const Sequence& params);

#define SERVICE_METHOD_DISPATCHER(class_name) \
Sequence class_name::f(const Sequence& method, const Sequence& params)\
{\
  long method_id = method;

#define SERVICE_METHOD_DISPATCHER_END \
}

#define SERVICE_METHOD_DISPATCHER_END2 \
  else if(false)\
  {\
    debug_line\
    return 0;\
    exception_throw_type(Exception::not_found)\
    exception_throw\
  }\
  return (Sequence) 0;\
}

#define SERVICE_REGISTER_METHOD_BY_NAME(method_name) \
  if(method == Sequence(#method_name))\
  {\
    debug_line\
    return method_name(params);\
  }

#define SERVICE_REGISTER_METHOD_BY_ID(method_name) \
  if(method_id == __COUNTER__)\
  {\
    return method_name(params);\
  }

#include "object.h"
//#include "number.h"
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
  virtual Sequence& f(Sequence& method, Sequence& params, Sequence& res); // can be reimplemented for performance-critical services
  virtual Sequence f(const Sequence& method, const Sequence& params) = 0;
//    virtual Sequence f(Sequence& i, Sequence& params) = 0;
//    virtual Sequence f2(const Sequence& i, Sequence& params);
//    virtual Sequence& f(number i, Sequence& params, Sequence& res) = 0;
//    virtual Sequence f(number i, Sequence& params);
  virtual inline Sequence create(Sequence params){return -1;};
  virtual inline Sequence open(Sequence params){return -1;};
  virtual inline Sequence close(Sequence params){return -1;};
};

#endif	/* SERVICE_H */

