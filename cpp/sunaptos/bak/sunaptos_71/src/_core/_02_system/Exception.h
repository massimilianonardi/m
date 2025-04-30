#ifndef EXCEPTION_H
#define	EXCEPTION_H

#include <exception>
#include <cstring>
#include <iostream>

#define exception_throw \
throw Exception(__FILE__, __LINE__, __func__);

#define exception_throw_type(type) \
throw Exception(__FILE__, __LINE__, __func__, type);

#define exception_throw_type_info(type, info) \
throw Exception(__FILE__, __LINE__, __func__, type, info);

// TODO use a define to control if to control the version of Exception to compile (catch all foreign exceptions, or faster custom Exception only)
#define exception_try \
try \
{ \
  Exception exception; \
  try \
  {

#define exception_checkpoint \
  exception.checkpoint(__FILE__, __LINE__, __func__);

#define exception_catch \
  } \
  catch(const Exception& e) \
  { \
    exception.add(e); \
    throw exception; \
  } \
  catch(const std::exception& e) \
  { \
    exception.add(__FILE__, __LINE__, __func__, ExceptionType::std_exception, e.what()); \
    throw exception; \
  } \
  catch(...) \
  { \
    exception.add(__FILE__, __LINE__, __func__, ExceptionType::undefined); \
    throw exception; \
  } \
} \
catch(Exception& e) \
{ \
  e.add(__FILE__, __LINE__, __func__);

#define exception_end \
}

#define exception_print_stack_trace \
  e.printstacktrace();

#define exception_rethrow_end \
  e.rethrow(__FILE__, __LINE__, __func__); \
  throw; \
exception_end

#define exception_print_end \
exception_print_stack_trace \
exception_end

enum class ExceptionType: int
{
  undefined = 0,
  null_pointer = 1,
  memory_allocation_failed = 2,
  index_out_of_boundaries = 3,
  not_found = 4,
  creation_failed = 5,
  open_failed = 6,
  invalid_operand = 7,
  std_exception = 100,
};

class Exception
{
protected:
  int sz;
  void* pb;
  void resize(const int size);
  void append(const char* pbuf);
  void append(const char* step, const char* file, unsigned int line, const char* function, ExceptionType type = ExceptionType::undefined, const char* info = 0);

public:
  Exception(): pb(0), sz(0) {append("\n");}
  virtual ~Exception(){free(pb); pb = 0;}
  
  Exception(const Exception& e): Exception() {*this = e;}
  Exception(Exception&& e): Exception() {*this = std::move(e);}
  Exception& operator=(const Exception& e){if(&e != this){memcpy(pb, e.pb, e.sz);}; return *this;}
  Exception& operator=(Exception&& e){if(&e != this){pb = e.pb; sz = e.sz; e.pb = 0; e.sz = 0;}; return *this;}
  
  bool operator==(const Exception& b) const;
  bool operator!=(const Exception& b) const {return !operator==(b);}
  
  Exception(const char* file, unsigned int line, const char* function, ExceptionType type = ExceptionType::undefined, const char* info = 0): Exception() {append("throw", file, line, function, type, info);}
  
  void add(const Exception& e){append((const char*) e.pb);}
  void add(const char* file, unsigned int line, const char* function, ExceptionType type = ExceptionType::undefined, const char* info = 0){append("catch", file, line, function, type, info);}
  void rethrow(const char* file, unsigned int line, const char* function){append("rethrow", file, line, function);}
  void checkpoint(const char* file, unsigned int line, const char* function){append("checkpoint", file, line, function);}
  const char* text(){return (const char*) pb;}
  void printstacktrace(){std::cerr << text();}
};

#endif	/* EXCEPTION_H */
