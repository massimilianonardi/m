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
typedef long SequenceIndex;
//typedef Sequence SequenceIndex;

//------------------------------------------------------------------------------

typedef ContainerBase<element, SequenceIndex> SequenceUntyped;

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

class Service;

class SequenceTyped: virtual public SequenceUntyped
{
protected:
  SequenceType t;
  
public:
  SequenceTyped(){*this = (long long) 0;}
  virtual ~SequenceTyped(){}
  
  // copy
//  SequenceTyped(const SequenceTyped& e){*this = e;}
//  virtual SequenceTyped& operator=(const SequenceTyped& e){return copy(e);}
//  SequenceTyped& copy(const SequenceTyped& e){if(&e != this) elems = e.elems; return *this;}
  
  // type conversions
  template <typename T> SequenceTyped(T e){*this = e;}

  template <typename T> operator T() const {return *(T*) elements.get();}
  operator element() const {return *(element*) elements.get();}
  operator bool() const {return *(bool*) elements.get();}
  operator int() const {return *(int*) elements.get();}
  operator long() const {return *(long*) elements.get();}
  operator long long() const {return *(long long*) elements.get();}
  operator float() const {return *(long double*) elements.get();}
  operator double() const {return *(long double*) elements.get();}
  operator long double() const {return *(long double*) elements.get();}
  operator const char*() const {return (const char*) elements.get();}
  operator char*() const {return (char*) elements.get();}
  operator Service*() const {return *(Service**) elements.get();}
  operator Service&() const {return **(Service**) elements.get();}

//  template <typename T> SequenceTyped& operator=(T e){elems.set(&e, sizeof(T)); return *this;}
//  template <typename T> SequenceTyped& operator=(T e){return *this = (long double) e;}
  template <typename T> SequenceTyped& operator=(T e){std::stringstream s; s << (long double) e; return *this = s.str().c_str();}
//  SequenceTyped& operator=(element e){return *this = (long long) e;}
//  SequenceTyped& operator=(bool e){return *this = (long long) e;}
//  SequenceTyped& operator=(int e){return *this = (long long) e;}
//  SequenceTyped& operator=(long e){return *this = (long long) e;}
//  SequenceTyped& operator=(long long e){elems.set(&e, sizeof(long long)); return *this;}
//  SequenceTyped& operator=(float e){return *this = (long double) e;}
//  SequenceTyped& operator=(double e){return *this = (long double) e;}
//  SequenceTyped& operator=(long double e){elems.set(&e, sizeof(long double)); return *this;}
  SequenceTyped& operator=(const char* e){elements.set(e, strlen(e) + 1); return *this;}
  SequenceTyped& operator=(char* e){elements.set(e, strlen(e) + 1); return *this;}
  SequenceTyped& operator=(Service* e){elements.set(&e, sizeof(Service*)); return *this;}
  SequenceTyped& operator=(Service& e){Service* pe = &e; *this = pe; return *this;}
  
  // access
//  void resize(const SequenceElementIndex& size){elems.resize(size);}
//  SequenceElementIndex size() const {return elems.size();}
//  element& get(const SequenceElementIndex& index){return ((element*) elems.get())[index];}
//  template <typename T> element& operator[](T index){return get(index);}
  const char* to_text() const;
  SequenceTyped& from_text(const char* t);
  char* text() const;
  
  // operators
  bool operator==(const SequenceTyped& e) const {if(&e == this) return true; else return elements == e.elements;}
  bool operator!=(const SequenceTyped& e) const {return !operator==(e);}
};

//------------------------------------------------------------------------------

//typedef ContainerBase<element, SequenceIndex> ElementContainer;
typedef SequenceTyped ElementContainer;

//------------------------------------------------------------------------------

class SequenceNodeSharedPointer;
typedef std::vector<SequenceNodeSharedPointer> SequenceContainer;
//typedef ContainerBase<SequenceNodeSharedPointer, SequenceIndex> SequenceContainer;

class SequenceNode: virtual public ElementContainer
{
protected:
  SequenceContainer seqs;
  
public:
  virtual ~SequenceNode(){};
  
  // using
//  using ElementContainer::ElementContainer;
//  using ElementContainer::operator=;
//  using ElementContainer::operator[];
//  using ElementContainer::get;
//  using ElementContainer::size;
//  using ElementContainer::resize;
  
  // sequences
  SequenceContainer& sequences(){return seqs;}
//  SequenceNode& operator()(const SequenceIndex& index){return sequences()[index];}
};

//------------------------------------------------------------------------------

class SequenceNodeSharedPointer
{
protected:
  std::shared_ptr<SequenceNode> sequence_node_shared_pointer;
  
public:
  SequenceNodeSharedPointer(){sequence_node_shared_pointer = std::shared_ptr<SequenceNode>(new SequenceNode());};
  virtual ~SequenceNodeSharedPointer(){};
  
  // copy
  SequenceNodeSharedPointer(const SequenceNodeSharedPointer& e){*this = e;}
  virtual SequenceNodeSharedPointer& operator=(const SequenceNodeSharedPointer& e){return copy(e);}
  SequenceNodeSharedPointer& copy(const SequenceNodeSharedPointer& e){if(&e != this) *sequence_node_shared_pointer = *e.sequence_node_shared_pointer; return *this;}
  SequenceNodeSharedPointer& link(const SequenceNodeSharedPointer& e){if(&e != this) sequence_node_shared_pointer = e.sequence_node_shared_pointer; return *this;}
  
  // container
  void resize(const SequenceIndex& size){(*sequence_node_shared_pointer).resize(size);}
  SequenceIndex size() const {return (*sequence_node_shared_pointer).size();}
  element& get(const SequenceIndex& index){return (*sequence_node_shared_pointer)[index];}
  
  // sequences
  SequenceContainer& sequences(){(*sequence_node_shared_pointer).sequences();}
  
  // operators
  template <typename T> element& operator[](T index){return get(index);}
  template <typename T> SequenceContainer& operator*(){return sequences();}
//  template <typename T> SequenceNode& operator()(T index){return sequences()[index];}
  template <typename T> SequenceNodeSharedPointer& operator()(T index){return sequences()[index];}
};

//------------------------------------------------------------------------------

#endif	// _SEQUENCE_H
