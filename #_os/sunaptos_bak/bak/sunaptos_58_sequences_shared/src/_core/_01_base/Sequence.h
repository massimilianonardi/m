#ifndef _SEQUENCE_H
#define	_SEQUENCE_H

#include "Object.h"
#include "Buffer.h"

#include <vector>
#include <memory>
#include <cstring>

class Service;
class Sequence;

#define empty_sequence Sequence()

typedef char element;
typedef long long integer;
typedef Sequence sequence;
typedef std::shared_ptr<Sequence> sequence_shared_pointer;

class Sequence: virtual public Object
{
protected:
  Buffer elems;
  std::vector<sequence_shared_pointer> subseqs;

public:
  // constructor and destructor
  inline Sequence(){*this = (long double) 0;}
  virtual ~Sequence();
  
  // copy
  inline Sequence(const Sequence& e){*this = e;}
  inline virtual Sequence& operator=(const Sequence& e){return copy(e);}
  inline Sequence& copy(const Sequence& e){if(&e != this){elems = e.elems; subseqs = e.subseqs;} return *this;}
//  Sequence& copy(Sequence& e);
//  Sequence(Sequence& e) = delete;
//  Sequence(Sequence e) = delete;
//  Sequence& operator=(Sequence& e) = delete;
//  Sequence& operator=(Sequence e) = delete;
  
  // type conversions
  inline Sequence(element e){*this = e;}
  inline Sequence(bool e){*this = e;}
  inline Sequence(int e){*this = e;}
  inline Sequence(long e){*this = e;}
  inline Sequence(long long e){*this = e;}
  inline Sequence(float e){*this = e;}
  inline Sequence(double e){*this = e;}
  inline Sequence(long double e){*this = e;}
  inline Sequence(const char* e){*this = e;}
  inline Sequence(char* e){*this = e;}
  inline Sequence(Service* e){*this = e;}
  inline Sequence(Service& e){*this = e;}

  inline operator element() const {return *(element*) elems.get();}
  inline operator bool() const {return *(bool*) elems.get();}
  inline operator int() const {return *(int*) elems.get();}
  inline operator long() const {return *(long*) elems.get();}
  inline operator long long() const {return *(long long*) elems.get();}
  inline operator float() const {return *(long double*) elems.get();}
  inline operator double() const {return *(long double*) elems.get();}
  inline operator long double() const {return *(long double*) elems.get();}
  inline operator const char*() const {return (const char*) elems.get();}
  inline operator char*() const {return (char*) elems.get();}
  inline operator Service*() const {return *(Service**) elems.get();}
  inline operator Service&() const {return **(Service**) elems.get();}

  inline Sequence& operator=(element e){return *this = (long long) e;}
  inline Sequence& operator=(bool e){return *this = (long long) e;}
  inline Sequence& operator=(int e){return *this = (long long) e;}
  inline Sequence& operator=(long e){return *this = (long long) e;}
  inline Sequence& operator=(long long e){elems.set(&e, sizeof(long long)); return *this;}
  inline Sequence& operator=(float e){return *this = (long double) e;}
  inline Sequence& operator=(double e){return *this = (long double) e;}
  inline Sequence& operator=(long double e){elems.set(&e, sizeof(long double)); return *this;}
  inline Sequence& operator=(const char* e){elems.set(e, strlen(e) + 1); return *this;}
  inline Sequence& operator=(char* e){elems.set(e, strlen(e) + 1); return *this;}
  inline Sequence& operator=(Service* e){elems.set(&e, sizeof(Service*)); return *this;}
  inline Sequence& operator=(Service& e){Service* pe = &e; *this = pe; return *this;}

  // size
  inline void resize_elements(const Sequence& size){elems.resize(size);}
  inline Sequence size_elements() const {return elems.size();}
  inline void resize_sequences(const Sequence& size){subseqs.resize((integer) size);}
  inline Sequence size_sequences() const {return (long long) subseqs.size();}
  
  // access
  inline const Sequence& constant() const {return *this;}
  inline void index_check_element(const Sequence& index) const {if((integer) index < 0 || (integer) size_elements() <= (integer) index) throw "index out of range";}
  inline void index_check_sequence(const Sequence& index) const {if((integer) index < 0 || (integer) size_sequences() <= (integer) index) throw "index out of range";}
  inline element& get_element(const Sequence& index){return ((element*) elems.get())[index];}
  inline Sequence& get_sequence(const Sequence& index) const {return *subseqs[(integer) index];}
  template <typename T> element& operator[](T index){return get_element(index);}
  template <typename T> Sequence& operator()(T index) const {return get_sequence(index);}
  
  // modifiers (implementation independent))
  inline Sequence& del_element(const Sequence& index){index_check_element(index); for(integer i = (integer) index + 1; i < (integer) size_elements(); i++) get_element(i - 1) = get_element(i); return *this;}
  inline Sequence& del_sequence(const Sequence& index){index_check_sequence(index); for(integer i = (integer) index + 1; i < (integer) size_sequences(); i++) get_sequence(i - 1) = get_sequence(i); return *this;}
  inline Sequence& ins_element(const Sequence& index){index_check_element(index); for(integer i = (integer) index + 1; i < (integer) size_elements(); i++) get_element(i) = get_element(i - 1); return *this;}
  inline Sequence& ins_sequence(const Sequence& index){index_check_sequence(index); for(integer i = (integer) index + 1; i < (integer) size_sequences(); i++) get_sequence(i) = get_sequence(i - 1); return *this;}
  const char* to_text() const;
  Sequence& from_text(const char* t);
  char* text() const;

  bool operator==(const Sequence& e) const;
//  bool operator<(const Sequence& e) const;
  inline bool operator!=(const Sequence& e) const {return !operator==(e);}
//  inline bool operator> (const Sequence& e) const {return e.operator<(*this);}
//  inline bool operator>=(const Sequence& e) const {return !operator<(e);}
//  inline bool operator<=(const Sequence& e) const {return !operator>(e);}

  template <typename T> Sequence& operator<<(T e);
//  template <typename T> Sequence& operator>>(T i);

  // test
  inline void resize(const Sequence& size){subseqs.resize((integer) size);}
  inline integer size() const {return (long long) subseqs.size();}
  inline Sequence& get(const Sequence& index) const {return *subseqs[(integer) index];}
//  inline Sequence size() const {return (long long) subseqs.size();}
  bool operator<(int e) const {return (integer) *this < e;}
  bool operator<(long e) const {return (integer) *this < e;}
};

//------------------------------------------------------------------------------

template <typename T>
Sequence& Sequence::operator<<(T e)
{
  resize_sequences((long long) size_sequences() + 1);
  get_sequence((long long) size_sequences() - 1) = e;
  return *this;
}

#endif	// _SEQUENCE_H
