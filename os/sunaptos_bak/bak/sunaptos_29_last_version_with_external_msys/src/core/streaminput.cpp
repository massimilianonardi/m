#include "sunaptos.h"

//StreamInput& StreamInput::operator>>(element& e)
//{
//  Buffer b;
//  b.resize(sizeof(element));
//  read(b);
//  e = *((element*) b.get());
//  return *this;
//}

StreamInput& StreamInput::operator>>(Buffer& b)
{
  read(b);
  return *this;
}
