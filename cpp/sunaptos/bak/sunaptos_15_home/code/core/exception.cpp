#include "sunaptos.h"

Exception::Exception(): params(Sequence())
{
}

Exception::Exception(Sequence& params): params(params)
{
}

Exception::~Exception()
{
}

Sequence& Exception::get()
{
  return params;
}
