#include "sunaptos.h"

FileInputStream::FileInputStream(char* name)
{
  f = fopen(name, "rb+");
  
  if(f == 0)
  {
    throw;
  }
}

FileInputStream::~FileInputStream()
{
  fclose(f);
}

void FileInputStream::read(Buffer& buffer)
{
  fread((void*) buffer.get(), 1, buffer.size(), f);
}

long FileInputStream::getReadPos()
{
  return ftell(f);
}

void FileInputStream::setReadPos(long pos)
{
  fseek(f, 0, pos);
}

bool FileInputStream::bosi()
{
  return getReadPos();
}

bool FileInputStream::eosi()
{
  return !(getReadPos() < size());
}

long FileInputStream::size()
{
  long prev=ftell(f);
  fseek(f, 0, SEEK_END);
  long sz = ftell(f);
  fseek(f, prev, SEEK_SET);
  return sz;
}
