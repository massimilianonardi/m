#include "sunaptos.h"

Exception::Exception(): params(sequence())
{
}

Exception::Exception(sequence& params): params(params)
{
}

Exception::~Exception()
{
}

sequence& Exception::get()
{
  return params;
}
