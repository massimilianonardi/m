#include "sunaptos.h"

StreamInput& StreamInput::operator>>(number& e)
{
  Buffer b;
  b.resize(sizeof(number));
  read(b);
  e = *((number*) b.get());
//  number tmp = 0;
//  debug("[StreamInput::operator>> 01]")
//  memcpy(&tmp, b.get(), sizeof(number));
//  debug("[StreamInput::operator>> 02]")
//  e = tmp;
//  debug("[StreamInput::operator>> 03]")
  return *this;
}

StreamInput& StreamInput::operator>>(Buffer& b)
{
  read(b);
  return *this;
}
