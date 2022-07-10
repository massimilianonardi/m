#ifndef _SEQUENCE_H
#define	_SEQUENCE_H

#include "Object.h"
#include "Buffer.h"
#include "Container.h"

#include <vector>
#include <memory>
#include <cstring>
#include <sstream>

//------------------------------------------------------------------------------

typedef char element;
typedef long SequenceElementIndex;
//typedef Sequence SequenceElementIndex;
class SequenceBaseContainer
{
protected:
  Buffer elements;
  
public:
  SequenceBaseContainer(){}
  virtual ~SequenceBaseContainer(){}
  
  // copy
  SequenceBaseContainer(const SequenceBaseContainer& e){*this = e;}
  virtual SequenceBaseContainer& operator=(const SequenceBaseContainer& e){return copy(e);}
  SequenceBaseContainer& copy(const SequenceBaseContainer& e){if(&e != this) elements = e.elements; return *this;}
  
  // access
  void resize(const SequenceElementIndex& size){elements.resize(size);}
  SequenceElementIndex size() const {return elements.size();}
  element& get(const SequenceElementIndex& index){return ((element*) elements.get())[index];}
  template <typename T> element& operator[](T index){return get(index);}
  
  // compare
  bool operator==(const SequenceBaseContainer& e) const {if(&e == this) return true; else return elements == e.elements;}
  bool operator!=(const SequenceBaseContainer& e) const {return !operator==(e);}
};

//------------------------------------------------------------------------------

class SequenceNode;
typedef std::shared_ptr<SequenceNode> sequence_node_shared_pointer;
typedef std::vector<sequence_node_shared_pointer> sequence_node_vector;
typedef Container<SequenceNode, SequenceElementIndex, sequence_node_vector> sequence_node_container;

class SequenceNode: virtual public SequenceBaseContainer
{
public:
  sequence_node_container sequences;

  virtual ~SequenceNode(){};
  
  // using
  using SequenceBaseContainer::SequenceBaseContainer;
  using SequenceBaseContainer::operator=;
  using SequenceBaseContainer::operator[];
  using SequenceBaseContainer::get;
  using SequenceBaseContainer::size;
  using SequenceBaseContainer::resize;
  
  // sequences
  template <typename T> SequenceNode& operator()(T index){return *sequences[index];}
};
typedef Container<element, SequenceElementIndex, SequenceNode> sequence_node;

//------------------------------------------------------------------------------

class Service;
class Sequence;
class SequenceElement;

#define empty_sequence Sequence()

typedef long long integer;
typedef Sequence sequence;

enum class SequenceType: long
{
  unspecified_pointer = -1,
  unspecified = 0,
  service = 1,
  boolean = 2,
  integer = 3,
  floating_point = 4,
  character = 5,
};
typedef enum SequenceType sequence_type;

class SequenceElement
{
protected:
  sequence_type t;
  Buffer elems;
  
public:
  SequenceElement(){*this = (long long) 0;}
  virtual ~SequenceElement(){}
  
  // copy
  SequenceElement(const SequenceElement& e){*this = e;}
  virtual SequenceElement& operator=(const SequenceElement& e){return copy(e);}
  SequenceElement& copy(const SequenceElement& e){if(&e != this) elems = e.elems; return *this;}
  
  // type conversions
  template <typename T> SequenceElement(T e){*this = e;}

  template <typename T> operator T() const {return *(T*) elems.get();}
  operator element() const {return *(element*) elems.get();}
  operator bool() const {return *(bool*) elems.get();}
  operator int() const {return *(int*) elems.get();}
  operator long() const {return *(long*) elems.get();}
  operator long long() const {return *(long long*) elems.get();}
  operator float() const {return *(long double*) elems.get();}
  operator double() const {return *(long double*) elems.get();}
  operator long double() const {return *(long double*) elems.get();}
  operator const char*() const {return (const char*) elems.get();}
  operator char*() const {return (char*) elems.get();}
  operator Service*() const {return *(Service**) elems.get();}
  operator Service&() const {return **(Service**) elems.get();}

//  template <typename T> SequenceElement& operator=(T e){elems.set(&e, sizeof(T)); return *this;}
//  template <typename T> SequenceElement& operator=(T e){return *this = (long double) e;}
  template <typename T> SequenceElement& operator=(T e){std::stringstream s; s << (long double) e; return *this = s.str().c_str();}
//  SequenceElement& operator=(element e){return *this = (long long) e;}
//  SequenceElement& operator=(bool e){return *this = (long long) e;}
//  SequenceElement& operator=(int e){return *this = (long long) e;}
//  SequenceElement& operator=(long e){return *this = (long long) e;}
//  SequenceElement& operator=(long long e){elems.set(&e, sizeof(long long)); return *this;}
//  SequenceElement& operator=(float e){return *this = (long double) e;}
//  SequenceElement& operator=(double e){return *this = (long double) e;}
//  SequenceElement& operator=(long double e){elems.set(&e, sizeof(long double)); return *this;}
  SequenceElement& operator=(const char* e){elems.set(e, strlen(e) + 1); return *this;}
  SequenceElement& operator=(char* e){elems.set(e, strlen(e) + 1); return *this;}
  SequenceElement& operator=(Service* e){elems.set(&e, sizeof(Service*)); return *this;}
  SequenceElement& operator=(Service& e){Service* pe = &e; *this = pe; return *this;}
  
  // access
  void resize(const SequenceElementIndex& size){elems.resize(size);}
  SequenceElementIndex size() const {return elems.size();}
  element& get(const SequenceElementIndex& index){return ((element*) elems.get())[index];}
  template <typename T> element& operator[](T index){return get(index);}
  
  // operators
  bool operator==(const SequenceElement& e) const {if(&e == this) return true; else return elems == e.elems;}
  bool operator!=(const SequenceElement& e) const {return !operator==(e);}
};

class Sequence: virtual public SequenceElement, virtual public Object
{
protected:
//  container_sequence sequences;

public:
  // constructor and destructor
//  inline Sequence(){*this = (long long) 0;}
//  inline Sequence(){}
  virtual ~Sequence();
  
  // using
  using SequenceElement::SequenceElement;
  using SequenceElement::operator=;
  using SequenceElement::operator[];
  using SequenceElement::get;
  using SequenceElement::size;
  using SequenceElement::resize;
  
  // modifiers (implementation independent))
  const char* to_text() const;
  Sequence& from_text(const char* t);
  char* text() const;

  bool operator==(const Sequence& e) const;
  inline bool operator!=(const Sequence& e) const {return !operator==(e);}
//  inline bool operator> (const Sequence& e) const {return e.operator<(*this);}
//  inline bool operator>=(const Sequence& e) const {return !operator<(e);}
//  inline bool operator<=(const Sequence& e) const {return !operator>(e);}

  // insert copy
//  template <typename T> Sequence& operator<<(T e){sequences << Sequence(e); return *this;}
  // insert shared pointer
//  template <typename T> Sequence& operator>>(T* pe);

//  bool operator<(int e) const {return (integer) *this < e;}
//  bool operator<(long e) const {return (integer) *this < e;}
};

#endif	// _SEQUENCE_H
