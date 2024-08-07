#include "datanumber.h"
#include <iostream>

DataNumber::DataNumber(int n)
{
  num = n;
}

DataNumber::DataNumber(long n)
{
  num = n;
}

DataNumber::DataNumber(float n)
{
  num = n;
}

DataNumber::DataNumber(bool n)
{
  num = n;
}

DataNumber::~DataNumber()
{
}

void DataNumber::read(StreamInput* si)
{
  Buffer* b;
  b = si->read(sizeof(num));
  num = *((long*) b->buffer);

  std::cout << "\nDataNumber::read num = " << num;
}

void DataNumber::write(StreamOutput* so)
{
  Buffer b;
  b.buffer = (void*) &num;
  b.size = sizeof(num);
  b.pos = b.size;
  so->write(&b);

  std::cout << "\nDataNumber::write num = " << num;
}

int DataNumber::geti()
{
  return num;
}

long DataNumber::getl()
{
  return num;
}

float DataNumber::getf()
{
  return num;
}

bool DataNumber::getb()
{
  return num;
}
