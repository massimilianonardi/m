#ifndef EXCEPTION_H
#define	EXCEPTION_H

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

#include "number.h"
#include "object.h"
#include "sequence.h"

class Exception: virtual public Object
{
  protected:
    Sequence params;

  public:
    Exception();
    Exception(Sequence& params);
    ~Exception();

    Sequence& get();
};

#endif	/* EXCEPTION_H */
