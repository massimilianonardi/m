#include "sunaptos.h"

StreamOutput& StreamOutput::operator<<(element& e)
{
  Buffer b;
  b.set(&e, sizeof(element));
  write(b);
  return *this;
}

StreamOutput& StreamOutput::operator<<(Buffer& b)
{
  write(b);
  return *this;
}
