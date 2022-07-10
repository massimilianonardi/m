#ifndef _SEQUENCE_H
#define	_SEQUENCE_H

#include "streamable.h"
#include "number.h"
#include <iostream>

class Sequence: virtual public Streamable
{
  protected:
    char* pb;
    number sz;
    number wd;

  public:
    Sequence();
    Sequence(const Sequence& seq);
    Sequence(number width);
    Sequence(const char* e);
    Sequence(const wchar_t* e);
    virtual ~Sequence();

    void read(StreamInput* si);
    void write(StreamOutput* so);

    number width();
    number size();
    void resize(number size);
//    void reserve(number size);

    template <typename T> operator T();
    template <typename T> T* get();
    template <typename T> T get(number i);
    template <typename T> Sequence& set(T e, number i);
    template <typename T> Sequence& ins(T e);
    template <typename T> Sequence& ins(T e, number i);
    template <typename T> Sequence& del(number i);
//    template <typename T> Sequence& del(number i, number j);
    template <typename T> Sequence& copy(T* pe, number size);
//    template <typename T> Sequence& operator()(T e, number i);

    // Storage-like features...
//    Sequence& get(Sequence& criteria);
//    Sequence& set(Sequence& criteria, Sequence& seq);
//    Sequence& ins(Sequence& criteria, Sequence& seq);
//    Sequence& del(Sequence& criteria);

    // operations (do not alter the original)
//    Sequence& sub(number i); // convenience for subsequence instead of get
//    Sequence& sub(number i, number j);
//    Sequence& app(Sequence& seq); // concatenation
//    Sequence& find(Sequence& seq); // find seq inside this and return ordered indexes of any occurrence
//    number find(Sequence& seq, number i); // find if seq is inside this at index i only
//    number comp(Sequence& seq); // size check, typecheck struct (number/seq at same places), compare each value elem
//    number comp(Sequence& seq, number i); // compare each value elem, i=0 stop, i=1 subseq recursion, i=-1
    // math operations
//    grad
//    div
//    integral
//    norm

//    Sequence& operator()(const Sequence& filter); // alias for get
//    Sequence& operator()(const Sequence& filter, const Sequence& seq); // alias for set
    Sequence& operator()(number i);
    number operator[](number i);

//    Sequence& operator+();
//    Sequence& operator-();
//    Sequence& operator!(); // depends on the definition of && and ||
//    Sequence& operator~(); // reverse order of elements

//    Sequence& operator*(const Sequence& seq); // vector scalar product, scalar product, matrix product
//    Sequence& operator/(const Sequence& seq); // vector gradient, scalar division
//    Sequence& operator%(const Sequence& seq); // vector product, scalar modulus

//    Sequence& operator+(const Sequence& seq); // vector sum, scalar sum
//    Sequence& operator-(const Sequence& seq);

    Sequence& operator<<(number e);
    Sequence& operator<<(Sequence* e);
    Sequence& operator<<(const char* e);
    Sequence& operator<<(const wchar_t* e);
//    Sequence& operator>>(number& e);
//    Sequence& operator>>(Sequence*& e);
//    Sequence& operator>>(const char*& e);
//    Sequence& operator>>(const wchar_t*& e);

//    Sequence& operator<(const Sequence& seq); // string-like comparison
//    Sequence& operator>(const Sequence& seq);
//    Sequence& operator<=(const Sequence& seq);
//    Sequence& operator>=(const Sequence& seq);

//    Sequence& operator==(const Sequence& seq); // decide which overloaded compare to use
//    Sequence& operator!=(const Sequence& seq);

//    Sequence& operator&(const Sequence& seq);

//    Sequence& operator^(const Sequence& seq); // exponentiation (scalar, vector and matrix)

//    Sequence& operator|(const Sequence& seq); // concatenation

//    Sequence& operator&&(const Sequence& seq);

//    Sequence& operator||(const Sequence& seq);

    Sequence& operator=(const Sequence& seq);
    Sequence& operator=(const char* e);
    Sequence& operator=(const wchar_t* e);
};

//------------------------------------------------------------------------------

template <typename T>
Sequence::operator T()
{
  return reinterpret_cast<T>(pb);
}

template <typename T>
T* Sequence::get()
{
  if(sizeof(T) != wd)
  {
    throw 0;
  }
  return reinterpret_cast<T*>(pb);
}

template <typename T>
T Sequence::get(number i)
{
//      if(sizeof(T) > wd)
//      {
//        throw 0;
//      }
  if(i < 0 || sz <= i)
  {
    throw 0;
  }
  // this means that put and get must be performed with same type because of alignement implied by
  // the following and put is different from that used by c-style casts.
  // the proper way should be a typedef char seqtype[wd] and cast to this type instead of T and then use
  // c-style casts...btw the current method is more general...think about!!!
  return *reinterpret_cast<T*>(pb + ((long long) wd * (long long) i));
}

template <typename T>
Sequence& Sequence::set(T e, number i)
{
  if(sizeof(T) > wd)
  {
    throw 0;
  }
  if(i < 0 || sz <= i)
  {
    throw 0;
  }
  *reinterpret_cast<T*>(pb + ((long long) wd * (long long) i)) = e;
  return *this;
}

template <typename T>
Sequence& Sequence::ins(T e)
{
  resize(sz + 1);
  set<T>(e, sz - 1);
  return *this;
}

template <typename T>
Sequence& Sequence::ins(T e, number i)
{
  if(i < 0 || sz < i)
  {
    throw 0;
  }
  resize(sz + 1);
  for(number ind = sz - 1; i < ind && ind < sz; ind--)
  {
    set<T>(get<T>(ind - 1), ind);
  }
  set<T>(e, i);
  return *this;
}

template <typename T>
Sequence& Sequence::del(number i)
{
  if(i < 0 || sz <= i)
  {
    throw 0;
  }
  for(number ind = i + 1; i < ind < sz; ind++)
  {
    set<T>(get<T>(ind), ind - 1);
  }
  resize(sz - 1);
  return *this;
}

//template <typename T>
//Sequence& Sequence::del(number i, number j)
//{
//  // todo: implement
//  if(i < 0 || sz <= i || j < 0 || sz <= j || i > j)
//  {
//    throw 0;
//  }
//  return *this;
//}

template <typename T>
Sequence& Sequence::copy(T* pe, number size)
{
  wd = sizeof(T);
  resize(size);
  memcpy(pb, pe, size * wd);
  return *this;
}

//template <typename T>
//Sequence& Sequence::operator()(T e, number i)
//{
//  return set<T>(e, i);
//}

#endif	// _SEQUENCE_H
