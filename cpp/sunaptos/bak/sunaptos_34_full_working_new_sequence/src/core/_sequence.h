#ifndef _SEQUENCE_H2
#define	_SEQUENCE_H2

//#include "sunaptos.h"

#include <cstdlib>
#include <cstdio>
#include <string>
#include <sstream>
#include <map>
#include <set>
#include <iostream>
using namespace std;
#include <windows.h>

#include "debug.h"
#include "object.h"
//#include "service.h"
#include "number.h"
#include "streamable.h"

class Service;

typedef char element;
//typedef bool element;

enum class sequence_type: long
{
  unspecified_pointer_t = -1,
  unspecified_t = 0,
  sequence_t = 1,
  service_t = 2,
//  object_t = 2,
  boolean_t = 100,
  integer_t = 110,
  floating_point_t = 120,
  timestamp_t = 130,
  date_t = 140,
  character_t = 200,
  string_ascii_t = 210,
  string_utf_8_t = 220,
  string_utf_16_t = 230,
  email_t = 360,
};
typedef enum sequence_type sequence_type;

// vanno reimplementati allocando la memoria strettamente necessaria e gestendo un formato "number" qualsivoglia grande, al limite distinguendo tra integer e floating point 
// così come implementato per "const char*". ovviamente le conversioni di tipi avvengono da/verso i tipi del c++ il "number" generale è gestito tramite conversioni da/verso 
// "element*" (element deve garantire sempre size=1 e (ATTENZIONE!) la sequenza "raw" element* deve essere terminata con un terminatore universale proprio come i codoni). 
// diverse possibilità:
// - indici indipendenti [i] e (i) per accedere ad elementi o sottosequenze della sequenza -> implementazione attuale. 
// - stesso indice, prima "raw", poi le sottosequenze
// - stesso indice, mixed
// TODO decidere se la copia è solo sulle referenze o proprio una copia. attualmente Buffer ha il default copy constructor e quindi copia il puntatore, vector non lo so. 
class sequence: virtual public Streamable
{
protected:
  sequence_type t;
  Buffer subseqs;
  Buffer elems;

public:
  // constructor and destructor
  sequence();
  virtual ~sequence();
  
  // copy
  sequence(const sequence& e);
  sequence& operator=(const sequence& e);
  sequence& copy(sequence& e);
  
  // type conversions
  sequence(bool e);
  sequence(int e);
  sequence(long e);
  sequence(long long e);
  sequence(float e);
  sequence(double e);
  sequence(long double e);
  sequence(const char* e);
  sequence(char* e);
  sequence(Service* e);

  operator bool();
  operator int();
  operator long();
  operator long long();
  operator float();
  operator double();
  operator long double();
  operator const char*();
  operator char*();
  operator Service*();

  sequence& operator=(bool e);
  sequence& operator=(int e);
  sequence& operator=(long e);
  sequence& operator=(long long e);
  sequence& operator=(float e);
  sequence& operator=(double e);
  sequence& operator=(long double e);
  sequence& operator=(const char* e);
  sequence& operator=(char* e);
  sequence& operator=(Service* e);

  // streamable interface
  void read(StreamInput& si);
  void write(StreamOutput& so);

  // access
//  sequence& get(const sequence& i);
//  sequence& get(sequence i);
//  sequence& del(sequence& i);
//  void resize(sequence size);
//  sequence size();
  sequence_type type();
//  void set_type(sequence_type type);
  sequence& get(long i);
  sequence& del(long i);
  void move(long i_dest, long i_source, long n);
  void resize(long size);
  long size();
  char* text();

  template <typename T> element& operator[](T i);
  template <typename T> sequence& operator()(T i);
  template <typename T> sequence& operator<<(T e);
  template <typename T> sequence& operator>>(T i);
};

//------------------------------------------------------------------------------

template <typename T>
element& sequence::operator[](T i)
{
//  return get((sequence) i);
  return ((element*) elems.get())[i];
}

template <typename T>
sequence& sequence::operator()(T i)
{
//  return get((sequence) i);
  return get(i);
}

template <typename T>
sequence& sequence::operator<<(T e)
{
//  return get((sequence) (this->size())) = (sequence) e;
//  return get(this->size()) = (sequence) e;
  sequence seq = sequence(e);
  return get(this->size()).copy(seq);
//  return get(this->size()) = e;
}

//template <>
//inline sequence& sequence::operator<< <const char*>(const char* e)
//{
//  return get(this->size()) = e;
//}

//template <>
//inline sequence& sequence::operator<< <char*>(char* e)
//{
//  return get(this->size()) = e;
//}

template <typename T>
sequence& sequence::operator>>(T i)
{
//  return del((sequence) i);
  return del(i);
}

#endif	// _SEQUENCE_H2
