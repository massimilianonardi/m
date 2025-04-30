#ifndef _SEQUENCE_H
#define	_SEQUENCE_H

#include "debug.h"
#include "Object.h"
#include "Buffer.h"
#include "Container.h"
#include "CastableBasicDataTypes.h"

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

//typedef CopyMoveLinkCapable<Buffer> bcml;
//typedef CopyMoveLinkCapable<std::vector<SequenceNode> > vcml;
//typedef Container<char, int, bcml> bcmlc;
typedef Container<char, int, Buffer> bcmlc;
//typedef Container<SequenceNode, int, vcml> vcmlc;
typedef Container<SequenceNode, int, std::vector<SequenceNode> > vcmlc;
typedef CastableBasicDataTypes<bcmlc> bcmlcd;

// sequence
//#define Sequence Container<element, SequenceIndex, SequenceNode>
//#define Sequence SequenceNode
//typedef Container<element, SequenceIndex, SequenceNode> Sequence;
typedef SequenceNode Sequence;
typedef Sequence sequence;

//------------------------------------------------------------------------------

//class SequenceNode: virtual public Buffer
//class SequenceNode: virtual public ContainerCastableBasicDataTypes<char, int, Buffer>
class SequenceNode: virtual public bcmlcd
//class SequenceNode
{
protected:
  vcmlc s;
  
public:
  using bcmlcd::bcmlcd;
  using bcmlcd::operator=;
//  using Buffer::Buffer;
//  using Buffer::operator=;
//  
//  SequenceNode(): Buffer() {}
//  using ContainerCastableBasicDataTypes<char, int, Buffer>::ContainerCastableBasicDataTypes;
//  using ContainerCastableBasicDataTypes<char, int, Buffer>::operator=;
//  
//  SequenceNode(): ContainerCastableBasicDataTypes() {}
  virtual ~SequenceNode(){}
  
  // copy - link
//  SequenceNode(const SequenceNode& e){*this = e;}
//  SequenceNode(SequenceNode&& e){*this = e;}
////  SequenceNode(const SequenceNode* e){*this = e;}
//  virtual SequenceNode& operator=(const SequenceNode& e){return copy(e);}
//  virtual SequenceNode& operator=(SequenceNode&& e){return copy(e);}
//  virtual SequenceNode& operator=(const SequenceNode& e){return ContainerCastableBasicDataTypes<char, int, Buffer>::operator=(e);}
//  virtual SequenceNode& operator=(SequenceNode&& e){return ContainerCastableBasicDataTypes<char, int, Buffer>::operator=(e);}
////  virtual SequenceNode& operator=(const SequenceNode* e){return link(*e);}
//  SequenceNode& copy(const SequenceNode& e){if(&e != this){Buffer::operator=(e); s = e.s;}; return *this;}
////  SequenceNode& link(const SequenceNode& e){if(&e != this){s = &(e.s);}; return *this;}

  // equality
//  bool operator==(const SequenceNode& e) const {return (Buffer::operator==(e)) && (s == e.s);}
//  bool operator!=(const SequenceNode& e) const {return !operator==(e);}

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
  vcmlc& sequences(){return s;}
  vcmlc sequences() const {return s;}
  vcmlc& operator()(){return sequences();}
  template <typename T> SequenceNode& operator()(T index){return s[index];}
  template <typename T> SequenceNode operator()(T index) const {return s[index];}
  
//  SequenceNode()
//  {
//    COPY_MOVE_LINK_CAPABLE_CONSTRUCT(Buffer, c)
//    CASTABLE_BASIC_DATA_TYPES_CONSTRUCT(t)
//  }
//  
//  COPY_MOVE_LINK_CAPABLE_MEMBERS(SequenceNode, Buffer, c)
//  CASTABLE_BASIC_DATA_TYPES_MEMBERS(SequenceNode, t, c->get, c->get, c->set)
//  CONTAINER_MEMBERS(SequenceNode, c->resize, c->size, c->operator[], c->operator[], char, int)
};

//------------------------------------------------------------------------------

#endif	// _SEQUENCE_H
