#ifndef SEQUENCE2_H
#define	SEQUENCE2_H

#include "sunaptos.h"

class sequence;
union element
{
  char c;
  long l;
  unsigned long lu;
  long long ll;
  unsigned long long llu;
  double d;
  long double dl;
  void* v;
  sequence* seq;
  Service* srv;
  element(int n): l(n) {}
  element(unsigned int n): lu(n) {}
  element(long n): l(n) {}
  element(unsigned long n): lu(n) {}
  element(long long n): ll(n) {}
  element(unsigned long long n): llu(n) {}
  element(double n): d(n) {}
  element(long double n): dl(n) {}
  element(void* p): v(p) {}
  operator char() {return c;}
  operator long() {return l;}
  operator unsigned long() {return lu;}
  operator long long() {return ll;}
  operator unsigned long long() {return llu;}
  operator double() {return d;}
  operator long double() {return dl;}
  operator void*() {return v;}
  operator sequence*() {return seq;}
  operator Service*() {return srv;}
};
typedef unsigned long sequence_index;

class sequence: virtual public Streamable
{
protected:
  element* pb;
  sequence_index sz;

  void resize(sequence_index size);
  element& get(sequence_index i);
  sequence& del(sequence_index i1, sequence_index i2);

public:
  sequence();
  sequence(sequence& seq);
  sequence(element& e);
  sequence(const char* e);
  virtual ~sequence();

  void read(StreamInput& si);
  void write(StreamOutput& so);

  element& get(element i);
  sequence& ins(element e);
  sequence& del(element i);
  char* text();

  operator char*();

  element size();

  sequence& copy(sequence& e);
  sequence& operator=(sequence e);
  sequence& operator=(sequence& e);

  template <typename T> element& operator[](T i);
  template <typename T> sequence& operator()(T i);
  template <typename T> sequence& operator<<(T e);
  template <typename T> sequence& operator>>(T i);
};

//------------------------------------------------------------------------------

template <typename T>
element& sequence::operator[](T i)
{
  return get((element) i);
}

template <typename T>
sequence& sequence::operator()(T i)
{
  return *(get((element) i).seq);
}

template <typename T>
sequence& sequence::operator<<(T e)
{
  return ins((element) e);
}

template <typename T>
sequence& sequence::operator>>(T i)
{
  return del((element) i);
}

#endif	/* SEQUENCE2_H */
