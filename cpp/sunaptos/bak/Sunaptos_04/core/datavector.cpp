#include "datavector.h"
#include <iostream>

DataVector::DataVector()
{
}

DataVector::~DataVector()
{
}

void DataVector::read(StreamInput* si)
{
  DataNumber vs = DataNumber(0);
  vs.read(si);
  long s = vs.getl();

  for(long i = 0; i < s; i++)
  {
    DataNumber dt = DataNumber(0);
    dt.read(si);
    long t = dt.getl();
    Streamable* o;
    std::cout << "\nDataVector::read type "  << t;
    if(t == 1)
    {
      o = new DataNumber(0);
      o->read(si);
    }
    else if(t == 2)
    {
      o = new DataString("");
      o->read(si);
    }
    else if(t == 3)
    {
      o = new DataVector();
      o->read(si);
    }
    else
    {
      // error throw exception
      std::cout << "\nDataVector::write wrong type exception!!!";
    }

    put(o);
  }

  std::cout << "\nDataVector::read size after read = " << size();
}

void DataVector::write(StreamOutput* so)
{
  long s = size();
  DataNumber vs = DataNumber(s);
  vs.write(so);

  for(long i = 0; i < size(); i++)
  {
    long t = 0;
    DataNumber* dn = getn(i);
    DataString* ds = gets(i);
    DataVector* dv = getv(i);
    if(dn)
    {
      t = 1;
    }
    else if(ds)
    {
      t = 2;
    }
    else if(dv)
    {
      t = 3;
    }
    else
    {
      // error throw exception
      std::cout << "\nDataVector::write wrong type exception!!!";
    }

    DataNumber dt = DataNumber(t);
    dt.write(so);

    get(i)->write(so);
    std::cout << "\nDataVector::write written type = " << dt.getl();
  }
}

long DataVector::size()
{
  return v.size();
}

void DataVector::put(Streamable* data)
{
  v.push_back(data);
}

void DataVector::put(Streamable* data, int i)
{
  v.insert(v.begin() + i, data);
}

Streamable* DataVector::get(int i)
{
  return v.at(i);
}

DataNumber* DataVector::getn(int i) throw (const char*)
{
  return dynamic_cast<DataNumber*>(get(i));
}

DataString* DataVector::gets(int i) throw (const char*)
{
  return dynamic_cast<DataString*>(get(i));
}

DataVector* DataVector::getv(int i) throw (const char*)
{
  return dynamic_cast<DataVector*>(get(i));
}
