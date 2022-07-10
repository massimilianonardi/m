#ifndef _SEQUENCE_H
#define	_SEQUENCE_H

#include "Object.h"
#include "Buffer.h"

#define empty_sequence Sequence()

class Service;

typedef char element;
//typedef bool element;

enum class SequenceType: long
{
  unspecified_pointer_t = -1,
  unspecified_t = 0,
  service_t = 1,
  boolean_t = 2,
  integer_t = 3,
  floating_point_t = 4,
  character_t = 5,
};
typedef enum SequenceType sequence_type;

// vanno reimplementati allocando la memoria strettamente necessaria e gestendo un formato "number" qualsivoglia grande, al limite distinguendo tra integer e floating point 
// così come implementato per "const char*". ovviamente le conversioni di tipi avvengono da/verso i tipi del c++ il "number" generale è gestito tramite conversioni da/verso 
// "element*" (element deve garantire sempre size=1 e (ATTENZIONE!) la sequenza "raw" element* deve essere terminata con un terminatore universale proprio come i codoni). 
// diverse possibilità:
// - indici indipendenti [i] e (i) per accedere ad elementi o sottosequenze della sequenza -> implementazione attuale. 
// - stesso indice, prima "raw", poi le sottosequenze
// - stesso indice, mixed
// TODO decidere se la copia è solo sulle referenze o proprio una copia. attualmente Buffer ha il default copy constructor e quindi copia il puntatore, vector non lo so. 
class Sequence: virtual public Object
{
protected:
  sequence_type t;
  Buffer subseqs;
  Buffer elems;

public:
  // constructor and destructor
  Sequence();
  virtual ~Sequence();
  
  // copy
  Sequence(const Sequence& e);
  virtual Sequence& operator=(const Sequence& e);
//  Sequence& copy(Sequence& e);
  Sequence& copy(const Sequence& e);
//  Sequence(Sequence& e) = delete;
//  Sequence(Sequence e) = delete;
//  Sequence& operator=(Sequence& e) = delete;
//  Sequence& operator=(Sequence e) = delete;
  
  // type conversions
  Sequence(bool e);
  Sequence(int e);
  Sequence(long e);
  Sequence(long long e);
  Sequence(float e);
  Sequence(double e);
  Sequence(long double e);
  Sequence(const char* e);
  Sequence(char* e);
  Sequence(Service* e);
  Sequence(Service& e);

  operator bool() const;
  operator int() const;
  operator long() const;
  operator long long() const;
  operator float() const;
  operator double() const;
  operator long double() const;
  operator const char*() const;
  operator char*() const;
  operator Service*() const;
  operator Service&() const;

  Sequence& operator=(bool e);
  Sequence& operator=(int e);
  Sequence& operator=(long e);
  Sequence& operator=(long long e);
  Sequence& operator=(float e);
  Sequence& operator=(double e);
  Sequence& operator=(long double e);
  Sequence& operator=(const char* e);
  Sequence& operator=(char* e);
  Sequence& operator=(Service* e);
  Sequence& operator=(Service& e);

  // access
//  Sequence& get(const Sequence& i);
//  Sequence& get(Sequence i);
//  Sequence& del(Sequence& i);
//  void resize(Sequence size);
//  Sequence size();
  sequence_type type() const;
//  void set_type(Sequence_type type);
  Sequence& get(long i) const;
  Sequence& get(long i);
  Sequence& del(long i);
  void move(long i_dest, long i_source, long n);
  void resize(long size);
  long size() const;
  const char* to_text() const;
  Sequence& from_text(const char* t);
  char* text() const;

  bool operator==(const Sequence& e) const;
//  bool operator<(const Sequence& e) const;
  inline bool operator!=(const Sequence& e) const {return !operator==(e);}
//  inline bool operator> (const Sequence& e) const {return e.operator<(*this);}
//  inline bool operator>=(const Sequence& e) const {return !operator<(e);}
//  inline bool operator<=(const Sequence& e) const {return !operator>(e);}

  template <typename T> element& operator[](T i);
  template <typename T> Sequence& operator()(T i) const;
//  template <typename T> Sequence& operator()(T i);
  template <typename T> Sequence& operator<<(T e);
  template <typename T> Sequence& operator>>(T i);
};

//------------------------------------------------------------------------------

typedef Sequence sequence;

template <typename T>
element& Sequence::operator[](T i)
{
//  return get((Sequence) i);
  return ((element*) elems.get())[i];
}

template <typename T>
Sequence& Sequence::operator()(T i) const
{
//  return get((Sequence) i);
  return get(i);
}

template <typename T>
Sequence& Sequence::operator<<(T e)
{
//  return get((Sequence) (this->size())) = (Sequence) e;
//  return get(this->size()) = (Sequence) e;
//  Sequence seq = Sequence(e);
//  return get(this->size()).copy(seq);
//  return get(this->size()).copy(e);
//  return get(this->size()) = e;
  get(this->size()) = e;
  return *this;
}

//template <>
//inline Sequence& Sequence::operator<< <const char*>(const char* e)
//{
//  return get(this->size()) = e;
//}

//template <>
//inline Sequence& Sequence::operator<< <char*>(char* e)
//{
//  return get(this->size()) = e;
//}

template <typename T>
Sequence& Sequence::operator>>(T i)
{
//  return del((Sequence) i);
  return del(i);
}

#endif	// _SEQUENCE_H
