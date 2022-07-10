#ifndef EXCEPTION_H
#define	EXCEPTION_H

#include "debug.h"

#include <exception>
#include <cstdlib>
#include <cstring>
#include <iostream>

#define exception_throw \
do \
{ \
  debug("exception_throw"); \
  throw exception(__FILE__, __LINE__, __func__); \
} \
while(0);

#define exception_throw_type(type) \
do \
{ \
  debug("exception_throw - type: " << (int) type); \
  throw exception(__FILE__, __LINE__, __func__, type); \
} \
while(0);

#define exception_throw_type_info(type, info) \
do \
{ \
  debug("exception_throw - type: " << (int) type << " info: " << info); \
  throw exception(__FILE__, __LINE__, __func__, type, info); \
} \
while(0);

// TODO use a define to control if to control the version of exception to compile (catch all foreign exceptions, or faster custom exception only)
#define exception_try \
try \
{ \
  exception ex7n; \
  try \
  {

#define exception_checkpoint \
  ex7n.checkpoint(__FILE__, __LINE__, __func__);

#define exception_catch \
  } \
  catch(const exception& e) \
  { \
    ex7n.add(e); \
    throw ex7n; \
  } \
  catch(const std::exception& e) \
  { \
    ex7n.add(__FILE__, __LINE__, __func__, exception_type::std_exception, e.what()); \
    throw ex7n; \
  } \
  catch(...) \
  { \
    ex7n.add(__FILE__, __LINE__, __func__, exception_type::undefined); \
    throw ex7n; \
  } \
} \
catch(exception& e) \
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

enum class exception_type: int
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

class exception
{
protected:
  int sz;
  void* pb;
  void resize(const int size);
  void append(const char* pbuf);
  void append(const char* step, const char* file, unsigned int line, const char* function, exception_type type = exception_type::undefined, const char* info = 0);

public:
  exception(): pb(0), sz(0) {append("\n");}
  virtual ~exception(){free(pb); pb = 0;}
  
  exception(const exception& e): exception() {*this = e;}
  exception(exception&& e): exception() {*this = std::move(e);}
  exception& operator=(const exception& e){if(&e != this){memcpy(pb, e.pb, e.sz);}; return *this;}
  exception& operator=(exception&& e){if(&e != this){pb = e.pb; sz = e.sz; e.pb = 0; e.sz = 0;}; return *this;}
  
  bool operator==(const exception& b) const;
  bool operator!=(const exception& b) const {return !operator==(b);}
  
  exception(const char* file, unsigned int line, const char* function, exception_type type = exception_type::undefined, const char* info = 0): exception() {append("throw", file, line, function, type, info);}
  
  void add(const exception& e){append((const char*) e.pb);}
  void add(const char* file, unsigned int line, const char* function, exception_type type = exception_type::undefined, const char* info = 0){append("catch", file, line, function, type, info);}
  void rethrow(const char* file, unsigned int line, const char* function){append("rethrow", file, line, function);}
  void checkpoint(const char* file, unsigned int line, const char* function){append("checkpoint", file, line, function);}
  const char* text(){return (const char*) pb;}
  void printstacktrace(){std::cerr << text();}
};

#endif	/* EXCEPTION_H */
