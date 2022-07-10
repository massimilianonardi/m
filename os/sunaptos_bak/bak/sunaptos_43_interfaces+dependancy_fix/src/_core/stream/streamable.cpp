#include "streamable.h"

StreamInput& operator>>(StreamInput& si, Streamable& e)
{
  e.read(si);
  return si;
}

StreamOutput& operator<<(StreamOutput& so, const Streamable& e)
{
  e.write(so);
  return so;
}
