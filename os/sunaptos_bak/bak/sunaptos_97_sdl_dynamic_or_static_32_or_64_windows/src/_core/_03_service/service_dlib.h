#ifndef SERVICE_DLIB_H
#define	SERVICE_DLIB_H

#include "dlib.h"
#include "sequence.h"
#include "service.h"
#include "exception.h"

#define SERVICE_EXPORT(class_name)\
DLIB_MAIN\
;\
extern "C"\
{\
\
service* create(SERVICE_METHOD_PARAMETERS)\
{\
  return new class_name(params);\
}\
\
void destroy(const service* obj)\
{\
  delete obj;\
}\
\
service* try_create(SERVICE_METHOD_PARAMETERS)\
{\
  exception_try\
  return create(params);\
  exception_catch\
  exception_print_stack_trace\
  return (service*) SERVICE_ERROR;\
  exception_end\
}\
\
SERVICE_METHOD_RETURN_TYPE try_destroy(const service* obj)\
{\
  exception_try\
  destroy(obj);\
  return SERVICE_NULL;\
  exception_catch\
  exception_print_stack_trace\
  return SERVICE_ERROR;\
  exception_end\
}\
\
} // extern "C"

#endif	/* SERVICE_DLIB_H */
