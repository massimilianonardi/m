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
//typedef unsigned char element;
typedef char element;
typedef int SequenceIndex;
//typedef Sequence SequenceIndex;

//------------------------------------------------------------------------------

class Service;
class SequenceNode;
class SequenceNodeContainer;

typedef SequenceNode Sequence;
typedef Sequence sequence;

//------------------------------------------------------------------------------

class SequenceNodeContainer
{
// COMMON ----------------------------------------------------------------------
protected:
  std::shared_ptr<std::vector<SequenceNode> > vector;
  
  SequenceNodeContainer& copy(const SequenceNodeContainer& sequence_node_container){if(&sequence_node_container != this){*vector = *sequence_node_container.vector;}; return *this;}
  SequenceNodeContainer& move(SequenceNodeContainer& sequence_node_container){if(&sequence_node_container != this){vector = std::move(sequence_node_container.vector);}; return *this;}
  SequenceNodeContainer& link(SequenceNodeContainer& sequence_node_container){if(&sequence_node_container != this){vector = sequence_node_container.vector;}; return *this;}
  
public:
  SequenceNodeContainer(): vector(std::shared_ptr<std::vector<SequenceNode> >(new std::vector<SequenceNode>())) {}
  virtual ~SequenceNodeContainer(){}
  
  bool operator==(const SequenceNodeContainer& sequence_node_container) const {return *vector == *(sequence_node_container.vector);}
  bool operator!=(const SequenceNodeContainer& sequence_node_container) const {return !operator==(sequence_node_container);}
  
// CONTAINER -------------------------------------------------------------------
  SequenceNodeContainer& resize(const SequenceIndex& size){vector->resize(size); return *this;}
  SequenceIndex size() const {return vector->size();}
  SequenceNode& operator[](const SequenceIndex& index){return vector->operator[](index);}
  const SequenceNode& operator[](const SequenceIndex& index) const {return vector->operator[](index);}
  
  // del ins shf/shift sub ext/extract find/search/query
  SequenceNodeContainer& del(const SequenceIndex& index, const SequenceIndex& size){vector->erase(vector->begin() + index, vector->begin() + size); return *this;}
  SequenceNodeContainer& del(const SequenceIndex& index){vector->erase(vector->begin() + index); return *this;}
  
  SequenceNodeContainer& ins(const SequenceNode& sequence_node, const SequenceIndex& index){vector->insert(vector->begin() + index, sequence_node); return *this;}
//  SequenceNodeContainer& ins(const SequenceNodeContainer& sequence_node_container, const SequenceIndex& index){buffer->ins(*(sequence_node.buffer), index); return *this;}
  
//  SequenceNodeContainer& move(const SequenceIndex& index, const SequenceIndex& size, const SequenceIndex& new_index){buffer->move(index, size, new_index); return *this;}
  
  SequenceNodeContainer& operator<<(const SequenceNode& sequence_node){return ins(sequence_node, size());}
//  SequenceNodeContainer& operator<<(const SequenceNodeContainer& sequence_node_container){return ins(sequence_node_container, size());}
  
// COPY MOVE LINK (copy, move, link) -------------------------------------------
public:
  SequenceNodeContainer(const SequenceNodeContainer& sequence_node_container): SequenceNodeContainer() {*this = sequence_node_container;}
  SequenceNodeContainer(SequenceNodeContainer&& sequence_node_container): SequenceNodeContainer() {*this = std::move(sequence_node_container);}
  SequenceNodeContainer(SequenceNodeContainer* sequence_node_container): SequenceNodeContainer() {*this = sequence_node_container;}
  
  SequenceNodeContainer& operator=(const SequenceNodeContainer& sequence_node_container){return copy(sequence_node_container);}
  SequenceNodeContainer& operator=(SequenceNodeContainer&& sequence_node_container){return move(sequence_node_container);}
  SequenceNodeContainer& operator=(SequenceNodeContainer* sequence_node_container){return link(*sequence_node_container);}
  
  SequenceNodeContainer& operator|(const SequenceNodeContainer& sequence_node_container){return copy(sequence_node_container);}
  SequenceNodeContainer& operator^(SequenceNodeContainer& sequence_node_container){return move(sequence_node_container);}
  SequenceNodeContainer& operator&(SequenceNodeContainer& sequence_node_container){return link(sequence_node_container);}
  
// ADVANCED CONVERSIONS --------------------------------------------------------
  // conversion - parsing
  std::string text() const;
  std::string to_text() const;
};

//------------------------------------------------------------------------------

enum class BasicDataTypes: char
{
  type_undefined = 0,
  type_number = 1,
  type_string = 2,
  type_void_pointer = 3,
};

enum class StandardDataTypes: int
{
  type_undefined = 1000,
  type_number = 1001,
  type_number_ieee754_single = 1002,
  type_number_ieee754_double = 1003,
  type_string_utf_8 = 1004,
  type_string_utf_16 = 1005,
  type_timestamp = 1006,
  type_date = 1007,
};

class SequenceNode
{
// COMMON ----------------------------------------------------------------------
protected:
  std::shared_ptr<Buffer> buffer;
  std::shared_ptr<Object> object;
  SequenceNodeContainer sequence_links;
  BasicDataTypes basic_data_type;
  StandardDataTypes standard_data_type;
  
  Buffer b;
  
  SequenceNode& copy(const SequenceNode& sequence_node){if(&sequence_node != this){*buffer = *sequence_node.buffer; *object = *sequence_node.object; sequence_links = sequence_node.sequence_links; basic_data_type = sequence_node.basic_data_type;}; return *this;}
  SequenceNode& move(SequenceNode& sequence_node){if(&sequence_node != this){buffer = std::move(sequence_node.buffer); object = std::move(sequence_node.object); sequence_links = std::move(sequence_node.sequence_links); basic_data_type = std::move(sequence_node.basic_data_type);}; return *this;}
  SequenceNode& link(SequenceNode& sequence_node){if(&sequence_node != this){buffer = sequence_node.buffer; object = sequence_node.object; sequence_links = &(sequence_node.sequence_links); basic_data_type = sequence_node.basic_data_type;}; return *this;}
  
  void* cast_pointer_get(){return (void*) buffer->get();}
  const void* cast_pointer_get() const {return (const void*) buffer->get();}
  void cast_pointer_set(const void* pbuf, const buffer_index& size){buffer->set(pbuf,size);}
  
public:
  SequenceNode(): buffer(std::shared_ptr<Buffer>(new Buffer())), basic_data_type(BasicDataTypes::type_undefined) {}
  virtual ~SequenceNode(){}
  
  bool operator==(const SequenceNode& sequence_node) const {return *buffer == *(sequence_node.buffer);}
  bool operator!=(const SequenceNode& sequence_node) const {return !operator==(sequence_node);}
  
// CONTAINER -------------------------------------------------------------------
  SequenceNode& resize(const SequenceIndex& size){buffer->resize(size); return *this;}
  SequenceIndex size() const {return buffer->size();}
  element& operator[](const SequenceIndex& index){return buffer->operator[](index);}
  const element& operator[](const SequenceIndex& index) const {return buffer->operator[](index);}
  
  // del ins shf/shift sub ext/extract find/search/query
  SequenceNode& del(const SequenceIndex& index, const SequenceIndex& size){buffer->del(index, size); return *this;}
  SequenceNode& del(const SequenceIndex& index){buffer->del(index); return *this;}
  
  SequenceNode& ins(const element& e, const SequenceIndex& index){buffer->ins(e, index); return *this;}
  SequenceNode& ins(const SequenceNode& sequence_node, const SequenceIndex& index){buffer->ins(*(sequence_node.buffer), index); return *this;}
  
  SequenceNode& move(const SequenceIndex& index, const SequenceIndex& size, const SequenceIndex& new_index){buffer->move(index, size, new_index); return *this;}
  
  SequenceNode& operator<<(const element& e){sequence_links << SequenceNode(e); return *this;}
  SequenceNode& operator<<(const SequenceNode& sequence_node){sequence_links << sequence_node; return *this;}
  SequenceNode& operator<<=(const element& e){return ins(e, size());}
  SequenceNode& operator<<=(const SequenceNode& sequence_node){return ins(sequence_node, size());}
  
// LINKS (sequence_links) ------------------------------------------------------
public:
  SequenceNodeContainer& operator()(){return sequence_links;}
  const SequenceNodeContainer& operator()() const {return sequence_links;}
  template <typename T> SequenceNode& operator()(T index){return sequence_links[index];}
  template <typename T> const SequenceNode& operator()(T index) const {return sequence_links[index];}
  
// COPY MOVE LINK (copy, move, link) -------------------------------------------
public:
  SequenceNode(const SequenceNode& sequence_node): SequenceNode() {*this = sequence_node;}
  SequenceNode(SequenceNode&& sequence_node): SequenceNode() {*this = std::move(sequence_node);}
  SequenceNode(SequenceNode* sequence_node): SequenceNode() {*this = sequence_node;}
  
  SequenceNode& operator=(const SequenceNode& sequence_node){return copy(sequence_node);}
  SequenceNode& operator=(SequenceNode&& sequence_node){return move(sequence_node);}
  SequenceNode& operator=(SequenceNode* sequence_node){return link(*sequence_node);}
  
  SequenceNode& operator|(const SequenceNode& sequence_node){return copy(sequence_node);}
  SequenceNode& operator^(SequenceNode& sequence_node){return move(sequence_node);}
  SequenceNode& operator&(SequenceNode& sequence_node){return link(sequence_node);}
  
// BASIC DATA TYPES CAST (basic_data_type, cast_pointer_get, cast_pointer_set) -
  SequenceNode(const double basic_data_type_element): SequenceNode() {*this = basic_data_type_element;}
  SequenceNode(const char* basic_data_type_element): SequenceNode() {*this = basic_data_type_element;}
  SequenceNode(const void* basic_data_type_element): SequenceNode() {*this = basic_data_type_element;}
  
  SequenceNode(const bool basic_data_type_element): SequenceNode() {*this = basic_data_type_element;}
  SequenceNode(const char basic_data_type_element): SequenceNode() {*this = basic_data_type_element;}
  SequenceNode(const short int basic_data_type_element): SequenceNode() {*this = basic_data_type_element;}
  SequenceNode(const int basic_data_type_element): SequenceNode() {*this = basic_data_type_element;}
  SequenceNode(const long int basic_data_type_element): SequenceNode() {*this = basic_data_type_element;}
  SequenceNode(const unsigned char basic_data_type_element): SequenceNode() {*this = basic_data_type_element;}
  SequenceNode(const unsigned short int basic_data_type_element): SequenceNode() {*this = basic_data_type_element;}
  SequenceNode(const unsigned int basic_data_type_element): SequenceNode() {*this = basic_data_type_element;}
  SequenceNode(const unsigned long int basic_data_type_element): SequenceNode() {*this = basic_data_type_element;}
  SequenceNode(const float basic_data_type_element): SequenceNode() {*this = basic_data_type_element;}
  
  operator double(){return *(double*) cast_pointer_get();}
  operator char*(){return (char*) cast_pointer_get();}
  operator void*(){return *(void**) cast_pointer_get();}
  
  operator bool(){return (bool) *(double*) cast_pointer_get();}
  operator char(){return (char) *(double*) cast_pointer_get();}
  operator short int(){return (short int) *(double*) cast_pointer_get();}
  operator int(){return (int) *(double*) cast_pointer_get();}
  operator long int(){return (long int) *(double*) cast_pointer_get();}
  operator unsigned char(){return (unsigned char) *(double*) cast_pointer_get();}
  operator unsigned short int(){return (unsigned short int) *(double*) cast_pointer_get();}
  operator unsigned int(){return (unsigned int) *(double*) cast_pointer_get();}
  operator unsigned long int(){return (unsigned long int) *(double*) cast_pointer_get();}
  operator float(){return (float) *(double*) cast_pointer_get();}
  
  operator double() const {return *(double*) cast_pointer_get();}
  operator char*() const {return (char*) cast_pointer_get();}
  operator void*() const {return *(void**) cast_pointer_get();}
  
  operator bool() const {return (bool) *(double*) cast_pointer_get();}
  operator char() const {return (char) *(double*) cast_pointer_get();}
  operator short int() const {return (short int) *(double*) cast_pointer_get();}
  operator int() const {return (int) *(double*) cast_pointer_get();}
  operator long int() const {return (long int) *(double*) cast_pointer_get();}
  operator unsigned char() const {return (unsigned char) *(double*) cast_pointer_get();}
  operator unsigned short int() const {return (unsigned short int) *(double*) cast_pointer_get();}
  operator unsigned int() const {return (unsigned int) *(double*) cast_pointer_get();}
  operator unsigned long int() const {return (unsigned long int) *(double*) cast_pointer_get();}
  operator float() const {return (float) *(double*) cast_pointer_get();}
  
  SequenceNode& operator=(double basic_data_type_element){*this = std::move(SequenceNode()); basic_data_type = BasicDataTypes::type_number; cast_pointer_set(&basic_data_type_element, sizeof(double)); return *this;}
  SequenceNode& operator=(const char* basic_data_type_element){*this = std::move(SequenceNode()); basic_data_type = BasicDataTypes::type_string; cast_pointer_set(basic_data_type_element, strlen(basic_data_type_element)); return *this;}
  SequenceNode& operator=(const void* basic_data_type_element){*this = std::move(SequenceNode()); basic_data_type = BasicDataTypes::type_void_pointer; cast_pointer_set(&basic_data_type_element, sizeof(void*)); return *this;}
  
  SequenceNode& operator=(bool basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  SequenceNode& operator=(char basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  SequenceNode& operator=(short int basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  SequenceNode& operator=(int basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  SequenceNode& operator=(long int basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  SequenceNode& operator=(unsigned char basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  SequenceNode& operator=(unsigned short int basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  SequenceNode& operator=(unsigned int basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  SequenceNode& operator=(unsigned long int basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  SequenceNode& operator=(float basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  
  BasicDataTypes type() const {return basic_data_type;}
//  BasicDataTypes basic_data_type_get() const {return basic_data_type;}
  void basic_data_type_set(BasicDataTypes type){basic_data_type = type;}
  
// ADVANCED CONVERSIONS --------------------------------------------------------
  // conversion - parsing
  std::string text() const;
  std::string to_text() const;
  SequenceNode& from_text(const char* t);
  
  // conversion - service
  SequenceNode(const std::shared_ptr<Object>& shared_pointer){*this = shared_pointer;}
  SequenceNode& operator=(const std::shared_ptr<Object>& shared_pointer){*this = std::move(SequenceNode()); object = shared_pointer; return *this;}
  operator Service&(){return *(Service*)(void*) object.get();}
  operator Service*(){return (Service*)(void*) object.get();}
  operator Service&() const {return *(Service*)(void*) object.get();}
  operator Service*() const {return (Service*)(void*) object.get();}
  Service& operator*(){return *(Service*)(void*) object.get();}
  Service* operator->(){return (Service*)(void*) object.get();}
};

#endif	// _SEQUENCE_H
