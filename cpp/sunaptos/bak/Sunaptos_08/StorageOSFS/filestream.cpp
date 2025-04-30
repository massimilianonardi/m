#include "filestream.h"

FileStream::FileStream(const char* name)
{
  file = fopen(name, "rb+");
}

FileStream::~FileStream()
{
  fclose(file);
}

long FileStream::size()
{
  long pos = ftell(file);
  fseek(file, 0, SEEK_END);
  long fsz = ftell(file);
  fseek(file, 0, pos);

  return fsz;
}

void FileStream::read(Buffer* buffer)
{
  buffer->resize(buffer->sz);
  fread((char*) buffer->pb, 1, buffer->sz, file);
}

long FileStream::getReadPos()
{
  return ftell(file);
}

void FileStream::setReadPos(long pos)
{
  fseek(file, 0, pos);
}

bool FileStream::bosi()
{
  return (ftell(file) == 0);
}

bool FileStream::eosi()
{
  return (ftell(file) == size());
}

void FileStream::write(Buffer* buffer)
{
  fwrite((char*) buffer->pb, 1, buffer->sz, file);
}

long FileStream::getWritePos()
{
  return ftell(file);
}

void FileStream::setWritePos(long pos)
{
  fseek(file, 0, pos);
}

bool FileStream::boso()
{
  return (ftell(file) == 0);
}

bool FileStream::eoso()
{
  return (ftell(file) == size());
}

void FileStream::create(const char* name)
{
  FILE* f = fopen(name, "wb");
  fclose(f);
}
