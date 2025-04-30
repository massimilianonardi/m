#ifndef DLIB_SERVICE_H
#define	DLIB_SERVICE_H

#ifdef	__cplusplus
extern "C"
{
#endif

// todo

#ifdef	__cplusplus
}
#endif

//------------------------------------------------------------------------------
#include "Sequence.h"
#include "Object.h"
#include "Service.h"
#include "Exception.h"

#define SERVICE_EXPORT(class_name)\
DLIB_MAIN\
;\
extern "C"\
{\
\
DLIB_FUNCTION_EXPORT Sequence* info()\
{\
  Sequence* info = new Sequence();\
  return info;\
}\
\
DLIB_FUNCTION_EXPORT Service* create(SERVICE_METHOD_PARAMETERS)\
{\
  return new class_name(params);\
}\
\
DLIB_FUNCTION_EXPORT void destroy(const Service* obj)\
{\
  delete obj;\
}\
\
DLIB_FUNCTION_EXPORT Service* try_create(SERVICE_METHOD_PARAMETERS)\
{\
  exception_try\
  return create(params);\
  exception_catch_print\
  return (Service*) SERVICE_ERROR;\
  exception_end\
}\
\
DLIB_FUNCTION_EXPORT SERVICE_METHOD_RETURN_TYPE try_destroy(const Service* obj)\
{\
  exception_try\
  destroy(obj);\
  return SERVICE_NULL;\
  exception_catch_print\
  return SERVICE_ERROR;\
  exception_end\
}\
\
} // extern "C"

#endif	/* DLIB_SERVICE_H */
