#include "sunaptos.h"

Buffer::Buffer(): pb(0), sz(0)
{
}

Buffer::Buffer(long size): pb(0), sz(0)
{
  resize(size);
}

Buffer::Buffer(const void* pbuf, long size): pb(0), sz(0)
{
  set(pbuf, size);
}

Buffer::~Buffer()
{
//  delete[] (char*) pb;
  free(pb);
  pb = 0;
}

long Buffer::size()
{
  return sz;
}

void Buffer::resize(long size)
{
//  void* ptmp = new char[size];
//  memcpy(ptmp, pb, sz);
////  memmove(ptmp, pb, sz);
//  delete[] (char*) pb;
//  pb = ptmp;
//  sz = size;
  
  sz = size;
  pb = realloc(pb, size);
//  pb = realloc(pb, size+1000);

//  sz = size;
//  if(size == 0)
//  {
//    free(pb);
//    pb = 0;
//    return;
//  }
//  void* ptmp = realloc(pb, size);
//  if(ptmp == 0)
//  {
//    debug("realloc failed!")
////    ptmp = malloc(size);
////    if(ptmp == 0)
////    {
////      free(pb);
////    }
////    else
////    {
////      ptmp = new char[size];
////      if(ptmp == 0)
////      {
////        delete[] pb;
////      }
////      else
////      {
////        throw 0;
////      }
////    }
//  }
//  pb = ptmp;
}

const void* Buffer::get()
{
  return (const void*) pb;
}

void Buffer::set(const void* pbuf, long size)
{
  resize(size); // handle resize exception
  memcpy(pb, pbuf, size);
}
