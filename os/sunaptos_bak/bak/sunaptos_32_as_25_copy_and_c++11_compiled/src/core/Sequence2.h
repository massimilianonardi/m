#ifndef SEQUENCE2_H
#define	SEQUENCE2_H

#include "sunaptos.h"

class sequence;

//enum type
//{
//  unspecified_pointer = -1,
//  unspecified = 0,
//  sequence = 1,
//  service = 2,
//  integer = 10,
//  floating_point = 20,
//  character = 30,
//  date = 40,
//  timestamp = 50,
//  email = 60,
//};
//typedef enum type element_t;

/*union element
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
//  element(sequence* p): seq(p) {}
//  element(Service* p): srv(p) {}
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
};*/

struct element
{
  union
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
  };
  enum type
  {
    unspecified_pointer_t = -1,
    unspecified_t = 0,
    sequence_t = 1,
    service_t = 2,
    integer_t = 10,
    floating_point_t = 20,
    character_t = 30,
    date_t = 40,
    timestamp_t = 50,
    email_t = 60,
  } t;
  element(char n): c(n), t(character_t) {}
  element(int n): l(n), t(integer_t) {}
  element(unsigned int n): lu(n), t(integer_t) {}
  element(long n): l(n), t(integer_t) {}
  element(unsigned long n): lu(n), t(integer_t) {}
  element(long long n): ll(n), t(integer_t) {}
  element(unsigned long long n): llu(n), t(integer_t) {}
  element(double n): d(n), t(floating_point_t) {}
  element(long double n): dl(n), t(floating_point_t) {}
  element(void* p): v(p), t(unspecified_pointer_t) {}
  element(sequence* p): seq(p), t(sequence_t) {}
  element(Service* p): srv(p), t(service_t) {}
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
typedef struct element element;

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
