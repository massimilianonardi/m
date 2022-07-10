#include "sunaptos.h"

StreamInput& operator>>(StreamInput& si, Streamable& e)
{
  e.read(si);
  return si;
}

StreamOutput& operator<<(StreamOutput& so, Streamable& e)
{
  e.write(so);
  return so;
}
