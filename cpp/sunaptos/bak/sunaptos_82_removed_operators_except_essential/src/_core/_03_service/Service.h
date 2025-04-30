#ifndef SERVICE_H
#define	SERVICE_H

#include "dlib.h"
#include "dlib_service.h"
#include "Exception.h"
#include "debug.h"

#define SERVICE_ERROR \
-1

#define SERVICE_NULL \
0

#define SERVICE_CLASS_NAME \
Service

#define SERVICE_METHODS_ENUM_NAME \
ServiceMethods

#define SERVICE_DISPATCHER_NAME \
f

#define SERVICE_WRAPPER_MEMBER_NAME \
srv

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

#define SERVICE_DISPATCHER_INLINE_WRAPPER \
inline virtual SERVICE_DISPATCHER_RETURN_TYPE SERVICE_DISPATCHER_NAME(SERVICE_DISPATCHER_PARAMETERS)\
{ \
  return SERVICE_WRAPPER_MEMBER_NAME->SERVICE_DISPATCHER_NAME(method, params); \
}

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
  info.links_ins(SERVICE_STRINGIFY(method_name)).links_ins(params); \
  exception_throw_type_info(ExceptionType::not_found, info.to_string().c_str()) \
}

#define SERVICE_METHOD_INLINE_REROUTE(method_name) \
inline virtual SERVICE_METHOD_RETURN_TYPE method_name(SERVICE_METHOD_PARAMETERS) \
{ \
  return f((int) ServiceMethods::method_name, params); \
}

#define SERVICE_METHOD_INLINE_WRAPPER(method_name) \
inline virtual SERVICE_METHOD_RETURN_TYPE method_name(SERVICE_METHOD_PARAMETERS) \
{ \
  return SERVICE_WRAPPER_MEMBER_NAME->method_name(params); \
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
  int method_id = method; \
  exception_try

#define SERVICE_DISPATCHER_END \
  Sequence info; \
  info.links_ins(method_id).links_ins(method).links_ins(params); \
  exception_throw_type_info(ExceptionType::not_found, info.to_string().c_str()) \
  exception_catch \
  exception_print_stack_trace \
  exception_end \
  return SERVICE_ERROR; \
}

//------------------------------------------------------------------------------
// INTERFACES
//------------------------------------------------------------------------------

#include "interfaces.h"

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

#include "Object.h"
#include "sequence.h"

class Service: virtual public Object
{
public:
//  inline Service(){};
  inline virtual ~Service(){};
  SERVICE_DISPATCHER_INTERFACE
  SERVICE_INTERFACES_INLINE_DEFAULT
  inline SERVICE_DISPATCHER_RETURN_TYPE operator()(SERVICE_DISPATCHER_PARAMETERS){return SERVICE_DISPATCHER_NAME(method, params);};

protected:
  inline Service(){};

private:
  // TODO: check if prevent copy is needed. since life of srv pointers is managed by ServiceLoader, copy of pointer is trivially wrong 
  // (user responsibility)), but what happens if i copy the srv object? deleting the pointer should not cause problems, but freeing 
  // the library from memory and then using the copied object, will cause segfault?
  inline Service(const Service& srv){};
//  inline Service& operator=(const Service& srv){};
};

#include <memory>

typedef std::shared_ptr<Service> service_shared_pointer;

extern Service& loader;
service_shared_pointer load(const Sequence& params);
service_shared_pointer load(const Sequence& name, const Sequence& params);

#endif	/* SERVICE_H */
