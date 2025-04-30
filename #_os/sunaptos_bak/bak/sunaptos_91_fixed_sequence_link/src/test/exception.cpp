#include "exception.h"

#include <cstdio>

bool exception::operator==(const exception& e) const
{
  if(sz == e.sz)
  {
    if(sz == 0)
    {
      return true;
    }
    else
    {
      return (0 == memcmp(pb, e.pb, sz));
    }
  }
  else
  {
    return false;
  }
  return false;
}

void exception::resize(const int size)
{
  void* ptmp = pb;
  // always add a zero at buffer end
  pb = realloc(pb, size + 1);
  if((pb == 0) && (size != 0))
  {
    pb = ptmp;
    return;
  }
  else
  {
    sz = size;
    // always add a zero at buffer end
    ((char*) pb)[size] = 0;
  }
  if(size == 0)
  {
    pb = 0;
  }
}

void exception::append(const char* pbuf)
{
  if(pbuf != 0)
  {
    int size = strlen(pbuf);
    resize(sz + size);
    memcpy(((char*) pb) + sz - size, pbuf, size);
  }
}

void exception::append(const char* step, const char* file, unsigned int line, const char* function, exception_type type, const char* info)
{
  char str[12];
  
  append("\"");
  
  append(step);
  
  append("\",\"");
  
  sprintf(str, "%d", line);
  append(str);
  
  append("\",\"");
  
  append(function);
  
  append("\",\"");
  
  sprintf(str, "%d", type);
  append(str);
  
  append("\",\"");
  
  append(info);
  
  append("\"");
  
  append("\n");
}
