#ifndef EXCEPTION_H
#define	EXCEPTION_H

#include <exception>

#define exception_throw \
throw Exception(__FILE__, __LINE__, __func__);

#define exception_throw_type(type) \
throw Exception(__FILE__, __LINE__, __func__, type);

#define exception_throw_type_info(type, info) \
throw Exception(__FILE__, __LINE__, __func__, type, info);

#define exception_try \
try\
{\
  Exception exception;\
  try\
  {

#define exception_checkpoint \
  exception.checkpoint(__FILE__, __LINE__, __func__);

#define exception_catch \
  }\
  catch(const Exception& e)\
  {\
    exception.add(e);\
    throw exception;\
  }\
  catch(const std::exception& e)\
  {\
    exception.add(__FILE__, __LINE__, __func__, Exception::std_exception, e.what());\
    throw exception;\
  }\
  catch(...)\
  {\
    exception.add(__FILE__, __LINE__, __func__, Exception::unknown);\
    throw exception;\
  }\
}\
catch(Exception& e)\
{\
  e.add(__FILE__, __LINE__, __func__);

#define exception_catch_print \
exception_catch\
  e.printstacktrace();

#define exception_print_stack_trace \
  e.printstacktrace();

//#define exception_print_stack_trace(output_stream) \
//  output_stream << e.text();
//
//#define exception_print_stack_trace_standard_output \
//  std::cout << e.text();
//
//#define exception_print_stack_trace_standard_error \
//  std::cerr << e.text();

#define exception_rethrow_end \
  e.rethrow(__FILE__, __LINE__, __func__);\
  throw;\
}

#define exception_print_end \
  e.printstacktrace();\
}

#define exception_end \
}

#include <sstream>

// TODO log everything to a configured system logger (file, std::cerr, etc.)
// now logs to std::cerr
class Exception//: virtual public Object
{
public:
  enum type
  {
    undefined,
    null_pointer,
    not_found,
    creation_failed,
    open_failed,
    division_by_zero,
    index_out_of_boundaries,
    memory_allocation_failed,
    std_exception,
    unknown
  } t;

protected:
  std::stringstream ss;

public:
  Exception();
  Exception(const char* file, unsigned long line, const char* function);
  Exception(const char* file, unsigned long line, const char* function, Exception::type type);
  Exception(const char* file, unsigned long line, const char* function, Exception::type type, const char* info);
  Exception(const Exception& e);
  Exception& operator=(const Exception& e);
  virtual ~Exception();
  
  void add(const Exception& e);
  void add(const char* file, unsigned long line, const char* function);
  void add(const char* file, unsigned long line, const char* function, Exception::type type);
  void add(const char* file, unsigned long line, const char* function, Exception::type type, const char* info);
  void rethrow(const char* file, unsigned long line, const char* function);
  void checkpoint(const char* file, unsigned long line, const char* function);
  const char* text();
  void printstacktrace();
};

#endif	/* EXCEPTION_H */
