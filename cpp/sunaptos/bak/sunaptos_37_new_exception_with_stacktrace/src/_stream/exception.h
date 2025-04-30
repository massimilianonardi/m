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

#define exception_print_stack_trace(output_stream) \
  output_stream << e.text();

#define exception_print_stack_trace_standard_output \
  std::cout << e.text();

#define exception_print_stack_trace_standard_error \
  std::cout << e.text();

#define exception_rethrow \
  e.rethrow(__FILE__, __LINE__, __func__);\
  throw;

#define exception_end \
}

// todo: check consinstency with sequences lifecycle and subseq destroying policy
#define try_managed \
Sequence* op = 0;\
try\
{\
  op = new Sequence();\
  Sequence& o = *op;

#define catch_managed(info) \
  delete op;\
}\
catch(...)\
{\
  try\
  {\
    try {throw;}\
    catch(Sequence& e) {*op << new Sequence(e); throw;}\
    catch(...) {throw;}\
  }\
  catch(...)\
  {\
    Sequence e;\
    e << info;\
    e << op;\
    debug(e.text())
    // todo: log stack trace

#define rethrow_managed \
  throw e;

#define exit_try_catch_managed \
  }\
}

#include <sstream>

class Exception//: virtual public Object
{
public:
  enum type
  {
    undefined,
    std_exception,
    unknown
  };

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
};

#endif	/* EXCEPTION_H */
