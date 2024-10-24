#ifndef _SEQUENCE_H
#define	_SEQUENCE_H

#include "debug.h"
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

class ContainerBasicDataTypes: virtual public BufferBasicDataTypes
{
protected:
  // hide selected methods that should not be visible after inheritance
  using BufferBasicDataTypes::set;
  
public:
//  using BufferBasicDataTypes::BufferBasicDataTypes;
  using BufferBasicDataTypes::operator=;
  
  ContainerBasicDataTypes(){}
  virtual ~ContainerBasicDataTypes(){}
  
  // access
  ContainerBasicDataTypes& resize(const SequenceIndex& size){BufferBasicDataTypes::resize(size); return *this;}
  SequenceIndex size() const {return BufferBasicDataTypes::size();}
  element& get(const SequenceIndex& index) const {return ((element*) BufferBasicDataTypes::get())[index];}
  element& operator[](const SequenceIndex& index) const {return get(index);}
};

//------------------------------------------------------------------------------

class SequenceNode;
typedef SequenceNode Service;

//typedef ContainerBase<element, SequenceIndex> ElementContainer;
typedef ContainerBasicDataTypes ElementContainer;
typedef std::shared_ptr<ElementContainer> ElementContainerSharedPointer;
class SequenceNode;
typedef std::vector<SequenceNode> SequenceNodeContainer;
typedef std::shared_ptr<SequenceNodeContainer> SequenceNodeContainerSharedPointer;

class SequenceNode
{
protected:
  ElementContainerSharedPointer elements;
  SequenceNodeContainerSharedPointer seqs;
  std::shared_ptr<Service> srv;
  
public:
  SequenceNode(): elements(ElementContainerSharedPointer(new ElementContainer())), seqs(SequenceNodeContainerSharedPointer(new SequenceNodeContainer())){}
  virtual ~SequenceNode(){}
  
  // copy
  SequenceNode(const SequenceNode& e){*this = e;}
  virtual SequenceNode& operator=(const SequenceNode& e){return copy(e);}
//  virtual SequenceNode& operator=(const SequenceNode& e){return link(e);}
  // TODO HANDLE SRV COPY
  SequenceNode& copy(const SequenceNode& e){if(&e != this){*elements = *e.elements; (*seqs).resize((*e.seqs).size()); *seqs = *e.seqs;}; return *this;}
  SequenceNode& link(const SequenceNode& e){if(&e != this){elements = e.elements; seqs = e.seqs; srv = e.srv;}; return *this;}
  
  // container
  SequenceNode& resize(const SequenceIndex& size){(*elements).resize(size); return *this;}
  SequenceIndex size() const {return (*elements).size();}
  element& get(const SequenceIndex& index) const {return (*elements)[index];}
  
  template <typename T> element& operator[](T index) const {return get(index);}
  
  bool operator==(const SequenceNode& e) const {return (*elements == *e.elements) && (*seqs == *e.seqs);}
  bool operator!=(const SequenceNode& e) const {return !operator==(e);}
  
  // sequences
  SequenceNodeContainer& sequences() const {return *seqs;}
  
  SequenceNodeContainer& operator()() const {return sequences();}
  template <typename T> SequenceNode& operator()(T index) const {return sequences()[index];}
  
  // conversion - basic types
  template <typename T> SequenceNode(T e):SequenceNode(){*this = e;}

  operator bool() const {return (bool) *elements;}
  operator char() const {return (char) *elements;}
  operator short int() const {return (short int) *elements;}
  operator int() const {return (int) *elements;}
  operator long int() const {return (long int) *elements;}
  operator long long int() const {return (long long int) *elements;}
  operator unsigned char() const {return (unsigned char) *elements;}
  operator unsigned short int() const {return (unsigned short int) *elements;}
  operator unsigned int() const {return (unsigned int) *elements;}
  operator unsigned long int() const {return (unsigned long int) *elements;}
  operator unsigned long long int() const {return (unsigned long long int) *elements;}
  operator float() const {return (float) *elements;}
  operator double() const {return (double) *elements;}
  operator long double() const {return (long double) *elements;}
  operator void*() const {return (void*) *elements;}
  operator wchar_t() const {return (wchar_t) *elements;}
  operator char*() const {return (char*) *elements;}
  operator wchar_t*() const {return (wchar_t*) *elements;}

  SequenceNode& operator=(bool e){*elements = e; return *this;}
  SequenceNode& operator=(char e){*elements = e; return *this;}
  SequenceNode& operator=(short int e){*elements = e; return *this;}
  SequenceNode& operator=(int e){*elements = e; return *this;}
  SequenceNode& operator=(long int e){*elements = e; return *this;}
  SequenceNode& operator=(long long int e){*elements = e; return *this;}
  SequenceNode& operator=(unsigned char e){*elements = e; return *this;}
  SequenceNode& operator=(unsigned short int e){*elements = e; return *this;}
  SequenceNode& operator=(unsigned int e){*elements = e; return *this;}
  SequenceNode& operator=(unsigned long int e){*elements = e; return *this;}
  SequenceNode& operator=(unsigned long long int e){*elements = e; return *this;}
  SequenceNode& operator=(float e){*elements = e; return *this;}
  SequenceNode& operator=(double e){*elements = e; return *this;}
  SequenceNode& operator=(long double e){*elements = e; return *this;}
  SequenceNode& operator=(void* e){*elements = e; return *this;}
  SequenceNode& operator=(wchar_t e){*elements = e; return *this;}
  
  SequenceNode& operator=(char* e){*elements = e; return *this;}
  SequenceNode& operator=(wchar_t* e){*elements = e; return *this;}

  SequenceNode& operator=(const char* e){*elements = e; return *this;}
  SequenceNode& operator=(const wchar_t* e){*elements = e; return *this;}
  
  std::string text() const;
  std::string to_text() const;
  SequenceNode& from_text(const char* t);
  
  // conversion - service
  SequenceNode(Service* e){*this = e;}
  operator Service*() const {return (Service*)(void*) *elements;}
  SequenceNode& operator=(Service* e){*elements = (void*) e; srv = std::shared_ptr<Service>(e); return *this;}
  
  operator Service&() const {return *(Service*)(void*) *elements;}
  Service& operator*(){return operator Service&();}
};

//------------------------------------------------------------------------------

class SequenceNodeBasicDataTypes: virtual public SequenceNode
{
protected:
  
public:
  SequenceNodeBasicDataTypes(){}
  virtual ~SequenceNodeBasicDataTypes(){}
  
  template <typename T> SequenceNodeBasicDataTypes(T e){*this = e;}

  operator bool() const {return (bool) *elements;}
  operator char() const {return (char) *elements;}
  operator short int() const {return (short int) *elements;}
  operator int() const {return (int) *elements;}
  operator long int() const {return (long int) *elements;}
  operator long long int() const {return (long long int) *elements;}
  operator unsigned char() const {return (unsigned char) *elements;}
  operator unsigned short int() const {return (unsigned short int) *elements;}
  operator unsigned int() const {return (unsigned int) *elements;}
  operator unsigned long int() const {return (unsigned long int) *elements;}
  operator unsigned long long int() const {return (unsigned long long int) *elements;}
  operator float() const {return (float) *elements;}
  operator double() const {return (double) *elements;}
  operator long double() const {return (long double) *elements;}
  operator void*() const {return (void*) *elements;}
  operator wchar_t() const {return (wchar_t) *elements;}
  operator char*() const {return (char*) *elements;}
  operator wchar_t*() const {return (wchar_t*) *elements;}

  SequenceNodeBasicDataTypes& operator=(bool e){*elements = e; return *this;}
  SequenceNodeBasicDataTypes& operator=(char e){*elements = e; return *this;}
  SequenceNodeBasicDataTypes& operator=(short int e){*elements = e; return *this;}
  SequenceNodeBasicDataTypes& operator=(int e){*elements = e; return *this;}
  SequenceNodeBasicDataTypes& operator=(long int e){*elements = e; return *this;}
  SequenceNodeBasicDataTypes& operator=(long long int e){*elements = e; return *this;}
  SequenceNodeBasicDataTypes& operator=(unsigned char e){*elements = e; return *this;}
  SequenceNodeBasicDataTypes& operator=(unsigned short int e){*elements = e; return *this;}
  SequenceNodeBasicDataTypes& operator=(unsigned int e){*elements = e; return *this;}
  SequenceNodeBasicDataTypes& operator=(unsigned long int e){*elements = e; return *this;}
  SequenceNodeBasicDataTypes& operator=(unsigned long long int e){*elements = e; return *this;}
  SequenceNodeBasicDataTypes& operator=(float e){*elements = e; return *this;}
  SequenceNodeBasicDataTypes& operator=(double e){*elements = e; return *this;}
  SequenceNodeBasicDataTypes& operator=(long double e){*elements = e; return *this;}
  SequenceNodeBasicDataTypes& operator=(void* e){*elements = e; return *this;}
  SequenceNodeBasicDataTypes& operator=(wchar_t e){*elements = e; return *this;}
  
  SequenceNodeBasicDataTypes& operator=(char* e){*elements = e; return *this;}
  SequenceNodeBasicDataTypes& operator=(wchar_t* e){*elements = e; return *this;}

  SequenceNodeBasicDataTypes& operator=(const char* e){*elements = e; return *this;}
  SequenceNodeBasicDataTypes& operator=(const wchar_t* e){*elements = e; return *this;}
  
//  std::string text() const;
//  const char* to_text() const;
//  SequenceNodeBasicDataTypes& from_text(const char* t);
};

//------------------------------------------------------------------------------
/*
class SequenceNodeServiceDataTypes;
typedef SequenceNodeServiceDataTypes Service;

class SequenceNodeServiceDataTypes: virtual public SequenceNodeBasicDataTypes
{
protected:
  std::shared_ptr<Service> srv;
  
public:
  using SequenceNodeBasicDataTypes::SequenceNodeBasicDataTypes;
  using SequenceNodeBasicDataTypes::operator=;
  
  SequenceNodeServiceDataTypes(){}
  virtual ~SequenceNodeServiceDataTypes(){}
  
  SequenceNodeServiceDataTypes(Service* e){*this = e;}
  operator Service*() const {return (Service*)(void*) *elements;}
  SequenceNodeBasicDataTypes& operator=(Service* e){*elements = (void*) e; srv = std::shared_ptr<Service>(e); return *this;}
  
  operator Service&() const {return *(Service*)(void*) *elements;}
  Service& operator*(){return operator Service&();}
};
*/
//------------------------------------------------------------------------------

//typedef SequenceNodeServiceDataTypes Sequence;
typedef SequenceNode Sequence;
typedef Sequence sequence;

//------------------------------------------------------------------------------

#endif	// _SEQUENCE_H
