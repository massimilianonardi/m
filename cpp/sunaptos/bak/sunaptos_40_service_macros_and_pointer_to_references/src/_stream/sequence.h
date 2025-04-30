#ifndef _SEQUENCE_H
#define	_SEQUENCE_H

#include "streamable.h"
#include "buffer.h"
//#include "object.h"

class Service;

typedef char element;
//typedef bool element;

enum class Sequence_type: long
{
  unspecified_pointer_t = -1,
  unspecified_t = 0,
  Sequence_t = 1,
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
typedef enum Sequence_type Sequence_type;

// vanno reimplementati allocando la memoria strettamente necessaria e gestendo un formato "number" qualsivoglia grande, al limite distinguendo tra integer e floating point 
// così come implementato per "const char*". ovviamente le conversioni di tipi avvengono da/verso i tipi del c++ il "number" generale è gestito tramite conversioni da/verso 
// "element*" (element deve garantire sempre size=1 e (ATTENZIONE!) la sequenza "raw" element* deve essere terminata con un terminatore universale proprio come i codoni). 
// diverse possibilità:
// - indici indipendenti [i] e (i) per accedere ad elementi o sottosequenze della sequenza -> implementazione attuale. 
// - stesso indice, prima "raw", poi le sottosequenze
// - stesso indice, mixed
// TODO decidere se la copia è solo sulle referenze o proprio una copia. attualmente Buffer ha il default copy constructor e quindi copia il puntatore, vector non lo so. 
class Sequence: virtual public Streamable
{
protected:
  Sequence_type t;
  Buffer subseqs;
  Buffer elems;

public:
  // constructor and destructor
  Sequence();
  virtual ~Sequence();
  
  // copy
  Sequence(const Sequence& e);
  Sequence& operator=(const Sequence& e);
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
  Sequence& operator=(Service& e);

  // streamable interface
  void read(StreamInput& si);
  void write(StreamOutput& so) const;

  // access
//  Sequence& get(const Sequence& i);
//  Sequence& get(Sequence i);
//  Sequence& del(Sequence& i);
//  void resize(Sequence size);
//  Sequence size();
  Sequence_type type();
//  void set_type(Sequence_type type);
  Sequence& get(long i) const;
  Sequence& get(long i);
  Sequence& del(long i);
  void move(long i_dest, long i_source, long n);
  void resize(long size);
  long size() const;
  char* text();

  inline bool operator==(const Sequence& e) const
  {
//    return (elems == e.elems);
//    return ((t == e.t) && (elems == e.elems));
//    return ((elems == e.elems) && (subseqs == e.subseqs));
//    return ((t == e.t) && (elems == e.elems) && (subseqs == e.subseqs));
    // TODO subseqs equality by iteration of each subseq
    bool res = ((t == e.t) && (elems == e.elems));
    for(long i = 0; i < size(); ++i)
    {
      res = res && (get(i) == e.get(i));
    }
    return res;
  }

//  inline bool operator<(const Sequence& e) const
//  {
//    /* do actual comparison */
//    return false;
//  }
  
  inline bool operator!=(const Sequence& e) const {return !operator==(e);}
//  inline bool operator> (const Sequence& e) const {return e.operator<(*this);}
//  inline bool operator>=(const Sequence& e) const {return !operator<(e);}
//  inline bool operator<=(const Sequence& e) const {return !operator>(e);}

  template <typename T> element& operator[](T i);
  template <typename T> Sequence& operator()(T i);
  template <typename T> Sequence& operator<<(T e);
  template <typename T> Sequence& operator>>(T i);
};

//------------------------------------------------------------------------------

template <typename T>
element& Sequence::operator[](T i)
{
//  return get((Sequence) i);
  return ((element*) elems.get())[i];
}

template <typename T>
Sequence& Sequence::operator()(T i)
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

//inline bool operator==(const Sequence& lhs, const Sequence& rhs)
//{
//  return ((lhs.t == rhs.t) && (lhs.elems == rhs.elems) && (lhs.subseqs == rhs.subseqs));
//}
//inline bool operator< (const Sequence& lhs, const Sequence& rhs)
//{
//  /* do actual comparison */
//  return false;
//}
//inline bool operator!=(const Sequence& lhs, const Sequence& rhs){return !operator==(lhs,rhs);}
//inline bool operator> (const Sequence& lhs, const Sequence& rhs){return  operator< (rhs,lhs);}
//inline bool operator<=(const Sequence& lhs, const Sequence& rhs){return !operator> (lhs,rhs);}
//inline bool operator>=(const Sequence& lhs, const Sequence& rhs){return !operator< (lhs,rhs);}

//#include "number.h"
//#include "streamable.h"
//#include "streaminput.h"
//#include "streamoutput.h"
//class Service;
//
//class Sequence: virtual public Streamable
//{
//  protected:
//    char* pb;
//    number sz;
//    number wd;
//
//  public:
//    Sequence();
//    Sequence(const Sequence& seq);
//    Sequence(number width);
//    Sequence(const char* e);
//    Sequence(const wchar_t* e);
//    virtual ~Sequence();
//
//    void read(StreamInput& si);
//    void write(StreamOutput& so);
//
////    void read(Buffer& b);
////    void write(Buffer& b);
//
//    number width();
//    number size();
//    void resize(number size);
////    void reserve(number size);
//    char* text();
//
//    template <typename T> operator T();
//    template <typename T> T* get();
//    template <typename T> T& get(number i);
//    template <typename T> Sequence& set(T e, number i);
//    template <typename T> Sequence& ins(T e);
//    template <typename T> Sequence& ins(T e, number i);
//    template <typename T> Sequence& del(number i);
////    template <typename T> Sequence& del(number i, number j);
//    template <typename T> Sequence& copy(T* pe, number size);
////    template <typename T> Sequence& operator()(T e, number i);
//
//    // Storage-like features...
////    Sequence& get(Sequence& criteria);
////    Sequence& set(Sequence& criteria, Sequence& seq);
////    Sequence& ins(Sequence& criteria, Sequence& seq);
////    Sequence& del(Sequence& criteria);
//
//    // operations (do not alter the original)
////    Sequence& sub(number i); // convenience for subsequence instead of get
////    Sequence& sub(number i, number j);
////    Sequence& app(Sequence& seq); // concatenation
////    Sequence& find(Sequence& seq); // find seq inside this and return ordered indexes of any occurrence
////    number find(Sequence& seq, number i); // find if seq is inside this at index i only
////    number comp(Sequence& seq); // size check, typecheck struct (number/seq at same places), compare each value elem
////    number comp(Sequence& seq, number i); // compare each value elem, i=0 stop, i=1 subseq recursion, i=-1
//    // math operations
////    grad
////    div
////    integral
////    norm
//
//    operator Service*();
//    
////    Sequence& operator()(const Sequence& filter); // alias for get
////    Sequence& operator()(const Sequence& filter, const Sequence& seq); // alias for set
//    Sequence& operator()(number i);
//    number& operator[](number i);
//    number& operator[](int i);
//
////    Sequence& operator+();
////    Sequence& operator-();
////    Sequence& operator!(); // depends on the definition of && and ||
////    Sequence& operator~(); // reverse order of elements
//
////    Sequence& operator*(const Sequence& seq); // vector scalar product, scalar product, matrix product
////    Sequence& operator/(const Sequence& seq); // vector gradient, scalar division
////    Sequence& operator%(const Sequence& seq); // vector product, scalar modulus
//
////    Sequence& operator+(const Sequence& seq); // vector sum, scalar sum
////    Sequence& operator-(const Sequence& seq);
//
//    Sequence& operator<<(number e);
//    Sequence& operator<<(Sequence* e);
//    Sequence& operator<<(const char* e);
//    Sequence& operator<<(const wchar_t* e);
////    Sequence& operator>>(number& e);
////    Sequence& operator>>(Sequence*& e);
////    Sequence& operator>>(const char*& e);
////    Sequence& operator>>(const wchar_t*& e);
//
////    Sequence& operator<(const Sequence& seq); // string-like comparison
////    Sequence& operator>(const Sequence& seq);
////    Sequence& operator<=(const Sequence& seq);
////    Sequence& operator>=(const Sequence& seq);
//
////    Sequence& operator==(const Sequence& seq); // decide which overloaded compare to use
////    Sequence& operator!=(const Sequence& seq);
//
////    Sequence& operator&(const Sequence& seq);
//
////    Sequence& operator^(const Sequence& seq); // exponentiation (scalar, vector and matrix)
//
////    Sequence& operator|(const Sequence& seq); // concatenation
//
////    Sequence& operator&&(const Sequence& seq);
//
////    Sequence& operator||(const Sequence& seq);
//
//    Sequence& operator=(const Sequence& seq);
//    Sequence& operator=(number e);
//    Sequence& operator=(const char* e);
//    Sequence& operator=(const wchar_t* e);
//};
//
////------------------------------------------------------------------------------
//
//template <typename T>
//Sequence::operator T()
//{
//  return reinterpret_cast<T>(pb);
//}
//
//template <typename T>
//T* Sequence::get()
//{
//  if(sizeof(T) != wd)
//  {
//    throw 0;
//  }
//  return reinterpret_cast<T*>(pb);
//}
//
//template <typename T>
//T& Sequence::get(number i)
//{
////      if(sizeof(T) > wd)
////      {
////        throw 0;
////      }
//  if(i < 0 || sz <= i)
//  {
//    throw 0;
//  }
//  // this means that put and get must be performed with same type because of alignement implied by
//  // the following and put is different from that used by c-style casts.
//  // the proper way should be a typedef char seqtype[wd] and cast to this type instead of T and then use
//  // c-style casts...btw the current method is more general...think about!!!
//  return *reinterpret_cast<T*>(pb + ((long long) wd * (long long) i));
//}
//
//template <typename T>
//Sequence& Sequence::set(T e, number i)
//{
//  if(sizeof(T) > wd)
//  {
//    throw 0;
//  }
//  if(i < 0 || sz <= i)
//  {
//    throw 0;
//  }
//  *reinterpret_cast<T*>(pb + ((long long) wd * (long long) i)) = e;
//  return *this;
//}
//
//template <typename T>
//Sequence& Sequence::ins(T e)
//{
//  resize(sz + 1);
//  set<T>(e, sz - 1);
//  return *this;
//}
//
//template <typename T>
//Sequence& Sequence::ins(T e, number i)
//{
//  if(i < 0 || sz < i)
//  {
//    throw 0;
//  }
//  resize(sz + 1);
//  for(number ind = sz - 1; i < ind && ind < sz; ind--)
//  {
//    set<T>(get<T>(ind - 1), ind);
//  }
//  set<T>(e, i);
//  return *this;
//}
//
//template <typename T>
//Sequence& Sequence::del(number i)
//{
//  if(i < 0 || sz <= i)
//  {
//    throw 0;
//  }
//  for(number ind = i + 1; i < ind < sz; ind++)
//  {
//    set<T>(get<T>(ind), ind - 1);
//  }
//  resize(sz - 1);
//  return *this;
//}
//
////template <typename T>
////Sequence& Sequence::del(number i, number j)
////{
////  // todo: implement
////  if(i < 0 || sz <= i || j < 0 || sz <= j || i > j)
////  {
////    throw 0;
////  }
////  return *this;
////}
//
//template <typename T>
//Sequence& Sequence::copy(T* pe, number size)
//{
//  wd = sizeof(T);
//  resize(size);
//  memcpy(pb, pe, size * wd);
//  return *this;
//}
//
////template <typename T>
////Sequence& Sequence::operator()(T e, number i)
////{
////  return set<T>(e, i);
////}

#endif	// _SEQUENCE_H
