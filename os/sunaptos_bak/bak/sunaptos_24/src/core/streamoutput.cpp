#include "sunaptos.h"

StreamOutput& StreamOutput::operator<<(number e)
{
  Buffer b;
  b.set(&e, sizeof(number));
  write(b);
  return *this;
}

StreamOutput& StreamOutput::operator<<(Buffer& b)
{
  write(b);
  return *this;
}
