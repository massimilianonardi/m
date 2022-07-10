#ifndef _SEQUENCE_H
#define	_SEQUENCE_H

#include "stream.h"
#include "streaminput.h"
#include "streamoutput.h"

class Service;
class sequence;

struct element
{
  union
  {
    bool b;
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
    boolean_t = 10,
    integer_t = 20,
    floating_point_t = 30,
    character_t = 40,
    date_t = 50,
    timestamp_t = 60,
    email_t = 70,
  } t;
  element(bool n): b(n), t(boolean_t) {}
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
  operator bool() {return b;}
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

class sequence: virtual public Streamable
{
protected:
  element* pb;
  element sz;
  enum type
  {
    unspecified_t = 0,
    string_ascii_t = 10,
    string_utf_8_t = 20,
    string_utf_16_t = 30,
    date_t = 40,
    timestamp_t = 50,
    email_t = 60,
  } t;

  void resize(element size);
  sequence& del(element i1, element i2);

public:
  sequence();
  sequence(sequence& seq);
  sequence(const sequence& seq);
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
//  sequence& operator=(const char* e);

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

template <>
inline sequence& sequence::operator<< <const char*>(const char* e)
{
  return ins((element) new sequence(e));
}

template <>
inline sequence& sequence::operator<< <char*>(char* e)
{
  return ins((element) new sequence(e));
}

template <typename T>
sequence& sequence::operator>>(T i)
{
  return del((element) i);
}

#endif	// _SEQUENCE_H
