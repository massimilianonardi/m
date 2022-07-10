#include "sunaptos.h"

FileOutputStream::FileOutputStream(Sequence& params)
{
  f = fopen(params, "wb");
  
  if(f == 0)
  {
    throw;
  }
}

FileOutputStream::~FileOutputStream()
{
  fclose(f);
}

void FileOutputStream::write(Buffer& buffer)
{
  fwrite(buffer.get(), 1, buffer.size(), f);
}

long FileOutputStream::getWritePos()
{
  return ftell(f);
}

void FileOutputStream::setWritePos(long pos)
{
  fseek(f, 0, pos);
}

bool FileOutputStream::boso()
{
  return getWritePos();
}

bool FileOutputStream::eoso()
{
  return !(getWritePos() < size());
}

long FileOutputStream::size()
{
  long prev=ftell(f);
  fseek(f, 0, SEEK_END);
  long sz = ftell(f);
  fseek(f, prev, SEEK_SET);
  return sz;
}
