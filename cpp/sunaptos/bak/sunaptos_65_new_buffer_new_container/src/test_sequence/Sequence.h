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

#define empty_sequence Sequence()
typedef char element;
typedef long SequenceIndex;
//typedef Sequence SequenceIndex;

//------------------------------------------------------------------------------

class Service;
class SequenceNode;

// elements
typedef Buffer ElementContainer;
//typedef Container<element, SequenceIndex, BufferBasicDataTypes > ElementContainer;
typedef std::shared_ptr<ElementContainer> ElementContainerSharedPointer;

// sequences
//typedef std::vector<SequenceNode> SequenceNodeContainer;
//typedef Container<SequenceNode, SequenceIndex, std::vector<SequenceNode> > SequenceNodeContainer;
//class SequenceNodeContainer: public virtual Container<SequenceNode, SequenceIndex, std::vector<SequenceNode> >
//{
//public:
////  using std::vector<SequenceNode>::operator=;
//  
//  SequenceNodeContainer(){}
//  virtual ~SequenceNodeContainer(){}
//  
//  // copy - link
//  SequenceNodeContainer(const SequenceNodeContainer& e){*this = e;}
//  virtual SequenceNodeContainer& operator=(const SequenceNodeContainer& e){return copy(e);}
//  SequenceNodeContainer& copy(const SequenceNodeContainer& e){std::vector<SequenceNode>::operator=(e); return *this;}
//};
//typedef std::shared_ptr<SequenceNodeContainer> SequenceNodeContainerSharedPointer;

// sequence
//#define Sequence Container<element, SequenceIndex, SequenceNode>
//#define Sequence SequenceNode
//typedef Container<element, SequenceIndex, SequenceNode> Sequence;
typedef SequenceNode Sequence;
typedef Sequence sequence;

//------------------------------------------------------------------------------

class SequenceNode: virtual public Buffer
{
protected:
  Container<SequenceNode, SequenceIndex, std::vector<SequenceNode> > s;
  
public:
  using Buffer::Buffer;
  using Buffer::operator=;
  
  SequenceNode(): Buffer() {}
  virtual ~SequenceNode(){}
  
  // copy - link
  SequenceNode(const SequenceNode& e){*this = e;}
  SequenceNode(SequenceNode&& e){*this = e;}
//  SequenceNode(const SequenceNode* e){*this = e;}
  virtual SequenceNode& operator=(const SequenceNode& e){return copy(e);}
  virtual SequenceNode& operator=(SequenceNode&& e){return copy(e);}
//  virtual SequenceNode& operator=(const SequenceNode* e){return link(*e);}
  SequenceNode& copy(const SequenceNode& e){if(&e != this){Buffer::operator=(e); s = e.s;}; return *this;}
//  SequenceNode& link(const SequenceNode& e){if(&e != this){s = &(e.s);}; return *this;}

  // equality
  bool operator==(const SequenceNode& e) const {return (Buffer::operator==(e)) && (s == e.s);}
  bool operator!=(const SequenceNode& e) const {return !operator==(e);}

  // conversion - parsing
  std::string text() const;
  std::string to_text() const;
  SequenceNode& from_text(const char* t);
  
  // conversion - service
//  SequenceNode(const std::shared_ptr<Object>& e){*this = e;}
//  SequenceNode& operator=(const std::shared_ptr<Object>& e){srv = e; *elements = (void*) e.get(); return *this;}
//  Service& operator*(){return *(Service*)(void*) *elements;}
//  Service* operator->(){return (Service*)(void*) *elements;}
  
  // container - sequences
  Container<SequenceNode, SequenceIndex, std::vector<SequenceNode> >& sequences(){return s;}
  Container<SequenceNode, SequenceIndex, std::vector<SequenceNode> > sequences() const {return s;}
  Container<SequenceNode, SequenceIndex, std::vector<SequenceNode> >& operator()(){return sequences();}
  template <typename T> SequenceNode& operator()(T index){return s[index];}
  template <typename T> SequenceNode operator()(T index) const {return s[index];}
};

//------------------------------------------------------------------------------

#endif	// _SEQUENCE_H
