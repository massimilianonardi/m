#ifndef DLIB_SERVICE_H
#define	DLIB_SERVICE_H

#include "dlib.h"
#include "Sequence.h"
#include "Service.h"
#include "Exception.h"

#define SERVICE_EXPORT(class_name)\
DLIB_MAIN\
;\
extern "C"\
{\
\
Service* create(SERVICE_METHOD_PARAMETERS)\
{\
  return new class_name(params);\
}\
\
void destroy(const Service* obj)\
{\
  delete obj;\
}\
\
Service* try_create(SERVICE_METHOD_PARAMETERS)\
{\
  exception_try\
  return create(params);\
  exception_catch\
  exception_print_stack_trace\
  return (Service*) SERVICE_ERROR;\
  exception_end\
}\
\
SERVICE_METHOD_RETURN_TYPE try_destroy(const Service* obj)\
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

#endif	/* DLIB_SERVICE_H */
