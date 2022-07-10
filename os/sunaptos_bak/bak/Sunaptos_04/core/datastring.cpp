
#include "buffer.h"

#include "datastring.h"
#include "datanumber.h"
#include <iostream>

DataString::DataString(const char* c)
{
  s = c;
}

DataString::~DataString()
{
}

void DataString::read(StreamInput* si)
{
  Buffer b;

  DataNumber vs = DataNumber(0);
  vs.read(si);
  long len = vs.getl();

  b.resize(len);
  si->read(&b);
  s = (char*) b.get();

  std::cout << "\nDataString::read s = " << s;
}

void DataString::write(StreamOutput* so)
{
  Buffer b;

  long len = size() + 1;
  DataNumber vs = DataNumber(len);
  vs.write(so);

  b.set(get(), len);
  so->write(&b);
  std::cout << "\nDataString::write s = " << s;
}

long DataString::size()
{
  return s.size();
}

void DataString::put(const char* c)
{
  s = c;
}

const char* DataString::get()
{
  return s.c_str();
}
