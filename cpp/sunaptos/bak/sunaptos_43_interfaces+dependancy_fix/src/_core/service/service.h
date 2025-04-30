#ifndef SERVICE_H
#define	SERVICE_H

#include "dlib.h"
#include "exception.h"
#include "debug.h"

#define SERVICE_ERROR \
-1

#define SERVICE_CLASS_NAME \
Service

#define SERVICE_METHODS_ENUM_NAME \
ServiceMethods

#define SERVICE_DISPATCHER_NAME \
f

#define SERVICE_DISPATCHER_RETURN_TYPE \
Sequence

#define SERVICE_DISPATCHER_PARAMETERS \
const Sequence& method, const Sequence& params

#define SERVICE_METHOD_RETURN_TYPE \
Sequence

#define SERVICE_METHOD_PARAMETERS \
const Sequence& params

#define SERVICE_STRINGIFY(string) \
#string

//------------------------------------------------------------------------------

#define SERVICE_DISPATCHER_INTERFACE \
virtual SERVICE_DISPATCHER_RETURN_TYPE SERVICE_DISPATCHER_NAME(SERVICE_DISPATCHER_PARAMETERS) = 0;

#define SERVICE_DISPATCHER_DECLARATION \
virtual SERVICE_DISPATCHER_RETURN_TYPE SERVICE_DISPATCHER_NAME(SERVICE_DISPATCHER_PARAMETERS);

#define SERVICE_DISPATCHER_DEFINITION(class_name) \
SERVICE_DISPATCHER_RETURN_TYPE class_name::SERVICE_DISPATCHER_NAME(SERVICE_DISPATCHER_PARAMETERS)

#define SERVICE_METHOD_INTERFACE(method_name) \
virtual SERVICE_METHOD_RETURN_TYPE method_name(SERVICE_METHOD_PARAMETERS) = 0;

#define SERVICE_METHOD_INTERFACE_USING(method_name) \
using SERVICE_CLASS_NAME::method_name;

#define SERVICE_METHOD_DECLARATION(method_name) \
virtual SERVICE_METHOD_RETURN_TYPE method_name(SERVICE_METHOD_PARAMETERS);

#define SERVICE_METHOD_DEFINITION(class_name, method_name) \
SERVICE_METHOD_RETURN_TYPE class_name::method_name(SERVICE_METHOD_PARAMETERS)

//------------------------------------------------------------------------------

#define SERVICE_METHOD_INLINE_DEFAULT(method_name) \
inline virtual SERVICE_METHOD_RETURN_TYPE method_name(SERVICE_METHOD_PARAMETERS) \
{ \
  Sequence info; \
  info << SERVICE_STRINGIFY(method_name) << params; \
  exception_throw_type_info(Exception::not_found, info.text()) \
}

#define SERVICE_METHOD_INLINE_REROUTE(method_name) \
inline virtual SERVICE_METHOD_RETURN_TYPE method_name(SERVICE_METHOD_PARAMETERS) \
{ \
  return f((long) ServiceMethods::method_name, params); \
}

//------------------------------------------------------------------------------

#define SERVICE_METHOD_REGISTER(method_name) \
if(method == Sequence(SERVICE_STRINGIFY(method_name))) \
{ \
  return method_name(params); \
}

#define SERVICE_METHOD_REGISTER_BY_ID_BEGIN \
switch(method_id) \
{

#define SERVICE_METHOD_REGISTER_BY_ID_END \
  default: \
  break; \
}

#define SERVICE_METHOD_REGISTER_BY_ID_EXPLICIT(method_custom_id, method_name) \
  case method_custom_id: \
    return method_name(params); \
  break;

#define SERVICE_METHOD_REGISTER_BY_ID(method_name) \
SERVICE_METHOD_REGISTER_BY_ID_EXPLICIT((long) SERVICE_METHODS_ENUM_NAME::method_name, method_name)

//------------------------------------------------------------------------------

#define SERVICE_DISPATCHER(class_name) \
SERVICE_DISPATCHER_DEFINITION(class_name) \
{ \
  long method_id = method; \
  exception_try

#define SERVICE_DISPATCHER_END \
  Sequence info; \
  info << method_id << method << params; \
  exception_throw_type_info(Exception::not_found, info.text()) \
  exception_catch_print \
  exception_end \
  return SERVICE_ERROR; \
}

//------------------------------------------------------------------------------
// INTERFACES
//------------------------------------------------------------------------------

#define SERVICE_METHOD_INTERFACE_NAME_0001 start
#define SERVICE_METHOD_INTERFACE_NAME_0002 stop
#define SERVICE_METHOD_INTERFACE_NAME_0003 create
#define SERVICE_METHOD_INTERFACE_NAME_0004 destroy
#define SERVICE_METHOD_INTERFACE_NAME_0005 notify

enum class SERVICE_METHODS_ENUM_NAME: long
{
  SERVICE_METHOD_INTERFACE_NAME_0001 = 1,
  SERVICE_METHOD_INTERFACE_NAME_0002 = 2,
  SERVICE_METHOD_INTERFACE_NAME_0003 = 3,
  SERVICE_METHOD_INTERFACE_NAME_0004 = 4,
  SERVICE_METHOD_INTERFACE_NAME_0005 = 5,
};

#define SERVICE_INTERFACES_USING \
SERVICE_METHOD_INTERFACE_USING(SERVICE_METHOD_INTERFACE_NAME_0001) \
SERVICE_METHOD_INTERFACE_USING(SERVICE_METHOD_INTERFACE_NAME_0002) \
SERVICE_METHOD_INTERFACE_USING(SERVICE_METHOD_INTERFACE_NAME_0003) \
SERVICE_METHOD_INTERFACE_USING(SERVICE_METHOD_INTERFACE_NAME_0004) \
SERVICE_METHOD_INTERFACE_USING(SERVICE_METHOD_INTERFACE_NAME_0005) \

#define SERVICE_INTERFACES_INLINE_DEFAULT \
SERVICE_METHOD_INLINE_DEFAULT(SERVICE_METHOD_INTERFACE_NAME_0001) \
SERVICE_METHOD_INLINE_DEFAULT(SERVICE_METHOD_INTERFACE_NAME_0002) \
SERVICE_METHOD_INLINE_DEFAULT(SERVICE_METHOD_INTERFACE_NAME_0003) \
SERVICE_METHOD_INLINE_DEFAULT(SERVICE_METHOD_INTERFACE_NAME_0004) \
SERVICE_METHOD_INLINE_DEFAULT(SERVICE_METHOD_INTERFACE_NAME_0005) \

#define SERVICE_INTERFACES_INLINE_REROUTE \
SERVICE_METHOD_INLINE_REROUTE(SERVICE_METHOD_INTERFACE_NAME_0001) \
SERVICE_METHOD_INLINE_REROUTE(SERVICE_METHOD_INTERFACE_NAME_0002) \
SERVICE_METHOD_INLINE_REROUTE(SERVICE_METHOD_INTERFACE_NAME_0003) \
SERVICE_METHOD_INLINE_REROUTE(SERVICE_METHOD_INTERFACE_NAME_0004) \
SERVICE_METHOD_INLINE_REROUTE(SERVICE_METHOD_INTERFACE_NAME_0005) \

#define SERVICE_INTERFACES_REGISTER_DISPATCH \
SERVICE_METHOD_REGISTER_BY_ID_BEGIN \
SERVICE_METHOD_REGISTER_BY_ID(SERVICE_METHOD_INTERFACE_NAME_0001) \
SERVICE_METHOD_REGISTER_BY_ID(SERVICE_METHOD_INTERFACE_NAME_0002) \
SERVICE_METHOD_REGISTER_BY_ID(SERVICE_METHOD_INTERFACE_NAME_0003) \
SERVICE_METHOD_REGISTER_BY_ID(SERVICE_METHOD_INTERFACE_NAME_0004) \
SERVICE_METHOD_REGISTER_BY_ID(SERVICE_METHOD_INTERFACE_NAME_0005) \
SERVICE_METHOD_REGISTER_BY_ID_END \
SERVICE_METHOD_REGISTER(SERVICE_METHOD_INTERFACE_NAME_0001) \
SERVICE_METHOD_REGISTER(SERVICE_METHOD_INTERFACE_NAME_0002) \
SERVICE_METHOD_REGISTER(SERVICE_METHOD_INTERFACE_NAME_0003) \
SERVICE_METHOD_REGISTER(SERVICE_METHOD_INTERFACE_NAME_0004) \
SERVICE_METHOD_REGISTER(SERVICE_METHOD_INTERFACE_NAME_0005) \

//------------------------------------------------------------------------------
// USER
//------------------------------------------------------------------------------

#define SERVICE_DECLARATIONS \
SERVICE_DISPATCHER_DECLARATION \
SERVICE_INTERFACES_USING

#define SERVICE_REGISTER(class_name) \
SERVICE_EXPORT(class_name) \
SERVICE_DISPATCHER(class_name) \
SERVICE_INTERFACES_REGISTER_DISPATCH

#define SERVICE_REGISTER_END \
SERVICE_DISPATCHER_END

//------------------------------------------------------------------------------

#include "object.h"
#include "sequence.h"

// each interface method must be:
// - assigned an id into ServiceMethods enum
// - defined-default here
// - registered into this dispatcher by id and by name
// - defined-reroute into ServiceClient

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
//  virtual Sequence& f(Sequence& method, Sequence& params, Sequence& res); // can be reimplemented for performance-critical services
//  SERVICE_METHOD_DISPATCHER_DEFINITION
//  virtual Sequence f(const Sequence& method, const Sequence& params) = 0;
  SERVICE_DISPATCHER_INTERFACE
  SERVICE_INTERFACES_INLINE_DEFAULT
};

#endif	/* SERVICE_H */

