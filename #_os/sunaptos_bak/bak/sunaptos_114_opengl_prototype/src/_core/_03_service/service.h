#ifndef SERVICE_H
#define	SERVICE_H

#include "dlib.h"
#include "service_dlib.h"
#include "exception.h"
#include "debug.h"

#define SERVICE_ERROR \
-1

#define SERVICE_NULL \
0

#define SERVICE_CLASS_NAME \
service

#define SERVICE_METHODS_ENUM_NAME \
ServiceMethods

#define SERVICE_DISPATCHER_NAME \
f

#define SERVICE_WRAPPER_MEMBER_NAME \
srv

#define SERVICE_DISPATCHER_RETURN_TYPE \
sequence

#define SERVICE_DISPATCHER_PARAMETERS \
const sequence& method, const sequence& params

#define SERVICE_METHOD_RETURN_TYPE \
sequence

#define SERVICE_METHOD_PARAMETERS \
const sequence& params

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
  sequence info; \
  info.links_ins(SERVICE_STRINGIFY(method_name)).links_ins(params); \
  exception_throw_type_info(exception_type::not_found, info.to_string().c_str()) \
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
if(method == sequence(SERVICE_STRINGIFY(method_name))) \
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
  sequence info; \
  info.links_ins(method_id).links_ins(method).links_ins(params); \
  exception_throw_type_info(exception_type::not_found, info.to_string().c_str()) \
  exception_catch \
  exception_print_stack_trace \
  exception_end \
  return SERVICE_ERROR; \
}

//------------------------------------------------------------------------------
// INTERFACES
//------------------------------------------------------------------------------

#include "service_interfaces.h"

//------------------------------------------------------------------------------
// USER
//------------------------------------------------------------------------------

//#define SERVICE_DECLARATIONS \
//SERVICE_DISPATCHER_DECLARATION \
//SERVICE_INTERFACES_USING

//#define SERVICE_REGISTER(class_name) \
//SERVICE_EXPORT(class_name) \
//SERVICE_DISPATCHER(class_name) \
//SERVICE_INTERFACES_REGISTER_DISPATCH

#define SERVICE_DISPATCHER_EXPAND(class_name) \
SERVICE_DISPATCHER(class_name) \
SERVICE_INTERFACES_REGISTER_DISPATCH

//#define SERVICE_REGISTER_END \
//SERVICE_DISPATCHER_END

//------------------------------------------------------------------------------

#include "sequence.h"

class service
{
public:
  virtual ~service(){};
//  SERVICE_DISPATCHER_INTERFACE
  SERVICE_DISPATCHER_DECLARATION
  SERVICE_INTERFACES_INLINE_DEFAULT
  SERVICE_DISPATCHER_RETURN_TYPE operator()(SERVICE_DISPATCHER_PARAMETERS){return SERVICE_DISPATCHER_NAME(method, params);};

protected:
//  inline service(){};

private:
  // TODO: check if prevent copy is needed. since life of srv pointers is managed by ServiceLoader, copy of pointer is trivially wrong 
  // (user responsibility)), but what happens if i copy the srv object? deleting the pointer should not cause problems, but freeing 
  // the library from memory and then using the copied object, will cause segfault?
//  inline service(const service& srv){};
//  inline service& operator=(const service& srv){};
//  service() = delete;
//  service(const service& srv) = delete;
//  service(service&& srv) = delete;
//  service& operator=(const service& srv) = delete;
//  service& operator=(service&& srv) = delete;
};

extern service& loader;

#endif	/* SERVICE_H */
