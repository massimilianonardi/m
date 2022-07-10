#ifndef EXCEPTION_H
#define	EXCEPTION_H

// todo: check consinstency with sequences lifecycle and subseq destroying policy
#define try_managed \
sequence* op = 0;\
try\
{\
  op = new sequence();\
  sequence& o = *op;

#define catch_managed(info) \
  delete op;\
}\
catch(...)\
{\
  try\
  {\
    try {throw;}\
    catch(sequence& e) {*op << e; throw;}\
    catch(...) {throw;}\
  }\
  catch(...)\
  {\
    sequence e;\
    e << info;\
//    e << sequence(info);\
    e << op;\
    debug(e.text())
    // todo: log stack trace

#define rethrow_managed \
  throw e;

#define exit_try_catch_managed \
  }\
}

#include "object.h"
#include "sequence.h"

class Exception: virtual public Object
{
  protected:
    sequence params;

  public:
    Exception();
    Exception(sequence& params);
    ~Exception();

    sequence& get();
};

#endif	/* EXCEPTION_H */
