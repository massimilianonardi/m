#ifndef _SEQUENCE_H
#define	_SEQUENCE_H

#include "debug.h"
#include "buffer.h"

#include <vector>
#include <memory>
#include <cstring>
#include <sstream>

//------------------------------------------------------------------------------

//typedef unsigned char element;
typedef char element;
typedef int SequenceIndex;
//typedef Sequence SequenceIndex;

//------------------------------------------------------------------------------

class service {};

//------------------------------------------------------------------------------

enum class sequence_type: unsigned char
{
  undefined = 0,
  number = 1,
  string = 2,
  pointer = 3,
  service = 4,
  stream = 5,
  sequence_dynamic = 10,
  sequence_executable = 11,
  number_ieee754_single = 20,
  number_ieee754_double = 21,
  timestamp = 30,
  date = 31,
  string_utf_8 = 40,
  string_utf_16 = 41,
  custom = 0xFF,
};

enum class SequenceOperation: char
{
  undefined = 0,
  del = 'd',
};

class sequence;

class sequence_data
{
public:
  SequenceIndex count;
  buffer data;
  std::vector<sequence> links;
  
//  sequence_data(): count(1), data(), links() {}
  virtual ~sequence_data(){}
};

class sequence
{
// COMMON ----------------------------------------------------------------------
public:
  
// COPY MOVE LINK --------------------------------------------------------------
protected:
  sequence_data* data_ptr;
  
  void create();
  void destroy();
  sequence& copy(const sequence& sequence_node);
  sequence& move(sequence& sequence_node);
  sequence& link(sequence& sequence_node);
  
public:
  sequence(){create();}
  virtual ~sequence(){destroy();}
  
  sequence(const sequence& sequence_node): sequence() {*this = sequence_node;}
  sequence(sequence&& sequence_node): sequence() {*this = std::move(sequence_node);}
  sequence(sequence* sequence_node): sequence() {*this = sequence_node;}
  
  sequence& operator=(const sequence& sequence_node){return copy(sequence_node);}
  sequence& operator=(sequence&& sequence_node){return move(sequence_node);}
  sequence& operator=(sequence* sequence_node){return link(*sequence_node);}
  
  // compares only data
  bool operator==(const sequence& sequence_node) const {return (data_ptr->data == sequence_node.data_ptr->data) && (data_ptr->links == sequence_node.data_ptr->links);}
  bool operator!=(const sequence& sequence_node) const {return !operator==(sequence_node);}
  // compares data (implicitly) and link
  bool operator==(const sequence* sequence_node) const {return data_ptr == sequence_node->data_ptr;}
  bool operator!=(const sequence* sequence_node) const {return !operator==(sequence_node);}
  
  sequence& unlink(){sequence tmp = *this; destroy(); create(); *this = std::move(tmp); return *this;}
  
// CONTAINER -------------------------------------------------------------------
public:
  sequence& resize(const SequenceIndex& size){data_ptr->data.resize(size); return *this;}
  SequenceIndex size() const {return data_ptr->data.size();}
  element& operator[](const SequenceIndex& index){return (data_ptr->data)[index];}
  const element& operator[](const SequenceIndex& index) const {return (data_ptr->data)[index];}
  
  sequence& del(const SequenceIndex& index, const SequenceIndex& size){data_ptr->data.del(index, size); return *this;}
  sequence& del(const SequenceIndex& index){data_ptr->data.del(index); return *this;}
  sequence& del(){data_ptr->data.del(); return *this;}
  
  sequence& ins(const element& e, const SequenceIndex& index){data_ptr->data.ins(e, index); return *this;}
  sequence& ins(const element& e){data_ptr->data.ins(e); return *this;}
  sequence& ins(const sequence& sequence_node, const SequenceIndex& index){data_ptr->data.ins(sequence_node.data_ptr->data, index); return *this;}
  sequence& ins(const sequence& sequence_node){data_ptr->data.ins(sequence_node.data_ptr->data); return *this;}
  
  sequence& move(const SequenceIndex& index, const SequenceIndex& size, const SequenceIndex& new_index){data_ptr->data.move(index, size, new_index); return *this;}
  
  sequence sub(const SequenceIndex& index, const SequenceIndex& size){sequence r; for(SequenceIndex i = 0; i < size; i++) r[i] = operator[](index + i); return r;}
  sequence extract(const SequenceIndex& index, const SequenceIndex& size){sequence r = std::move(sub(index, size)); del(index, size); return r;}
  
// LINKS -----------------------------------------------------------------------
public:
  sequence& links_resize(const SequenceIndex& size){data_ptr->links.resize(size); return *this;}
  SequenceIndex links_size() const {return data_ptr->links.size();}
  sequence& operator()(const SequenceIndex& index){return (data_ptr->links)[index];}
  const sequence& operator()(const SequenceIndex& index) const {return (data_ptr->links)[index];}
  sequence& links_get(const sequence& sequence_node){sequence* r = &((*this)(sequence_node(0))); for(SequenceIndex i = 1; i < sequence_node.links_size(); i++){r = &((*r)(sequence_node(i)));}; return *r;}
  
  sequence& links_del(const SequenceIndex& index, const SequenceIndex& size){data_ptr->links.erase(data_ptr->links.begin() + index, data_ptr->links.begin() + size); return *this;}
  sequence& links_del(const SequenceIndex& index){data_ptr->links.erase(data_ptr->links.begin() + index); return *this;}
  sequence& links_del(){data_ptr->links.erase(data_ptr->links.end() - 1); return *this;}
  
  sequence& links_ins(const sequence& sequence_node, const SequenceIndex& index){data_ptr->links.insert(data_ptr->links.begin() + index, sequence_node); return *this;}
  sequence& links_ins(sequence&& sequence_node, const SequenceIndex& index){data_ptr->links.insert(data_ptr->links.begin() + index, std::move(sequence_node)); return *this;}
  sequence& links_ins(sequence* sequence_node, const SequenceIndex& index){data_ptr->links.insert(data_ptr->links.begin() + index, sequence()); (data_ptr->links)[index].link(*sequence_node); return *this;}
  sequence& links_ins(const sequence& sequence_node){data_ptr->links.push_back(sequence_node); return *this;}
  sequence& links_ins(sequence&& sequence_node){data_ptr->links.push_back(std::move(sequence_node)); return *this;}
  sequence& links_ins(sequence* sequence_node){data_ptr->links.push_back(sequence()); (data_ptr->links)[links_size() - 1].link(*sequence_node); return *this;}
  // to prevent interpreting integers as sequence*
  template <typename T> sequence& links_ins(const T& e, const SequenceIndex& index){return links_ins(sequence(e), index);}
  template <typename T> sequence& links_ins(const T& e){return links_ins(sequence(e));}
  
//  sequence& links_move(const SequenceIndex& index, const SequenceIndex& size, const SequenceIndex& new_index){buffer->move(index, size, new_index); return *this;}
  
// TYPE ------------------------------------------------------------------------
public:
  sequence_type type() const {if(size() == 0){return sequence_type::undefined;}; return (sequence_type)(*this)[0];}
  sequence& type_set(const sequence_type& type){if(size() == 0) resize(1); (*this)[0] = (unsigned char) type; return *this;}
  
  sequence& type_custom_set(const double custom_data_type){*this = custom_data_type; type_set(sequence_type::custom); return *this;}
  sequence& type_custom_set(const char* custom_data_type){*this = custom_data_type; type_set(sequence_type::custom); return *this;}
  
  bool is_undefined() const {return type() == sequence_type::undefined;}
  
// BASIC DATA TYPES CAST -------------------------------------------------------
protected:
  const void* get() const {return (const void*) data_ptr->data.get(1);}
  sequence& set(const void* pbuf, const SequenceIndex& size){data_ptr->data.set(pbuf, size, 1); return *this;}
  
public:
  sequence(const double basic_data_type_element): sequence() {*this = basic_data_type_element;}
  sequence(const char* basic_data_type_element): sequence() {*this = basic_data_type_element;}
  sequence(const void* basic_data_type_element): sequence() {*this = basic_data_type_element;}
  
  operator double(){return *(double*) get();}
  operator char*(){return (char*) get();}
  operator void*(){return *(void**) get();}
  
  operator double() const {return *(double*) get();}
  operator char*() const {return (char*) get();}
  operator void*() const {return *(void**) get();}
  
  sequence& operator=(const double basic_data_type_element){*this = std::move(sequence()); set(&basic_data_type_element, sizeof(double)); type_set(sequence_type::number_ieee754_double); return *this;}
  sequence& operator=(const char* basic_data_type_element){*this = std::move(sequence()); set(basic_data_type_element, strlen(basic_data_type_element) + 1); type_set(sequence_type::undefined); return *this;}
  sequence& operator=(const void* basic_data_type_element){*this = std::move(sequence()); set(&basic_data_type_element, sizeof(void*)); type_set(sequence_type::pointer); return *this;}
  
  bool operator==(const double basic_data_type_element) const {return ((double) *this == basic_data_type_element);}
  bool operator!=(const double basic_data_type_element) const {return !operator==(basic_data_type_element);}
  bool operator==(const char* basic_data_type_element) const {return ((char*) *this == basic_data_type_element);}
  bool operator!=(const char* basic_data_type_element) const {return !operator==(basic_data_type_element);}
  bool operator==(const void* basic_data_type_element) const {return ((void*) *this == basic_data_type_element);}
  bool operator!=(const void* basic_data_type_element) const {return !operator==(basic_data_type_element);}
  
  sequence(const bool basic_data_type_element): sequence() {*this = basic_data_type_element;}
  sequence(const char basic_data_type_element): sequence() {*this = basic_data_type_element;}
  sequence(const short int basic_data_type_element): sequence() {*this = basic_data_type_element;}
  sequence(const int basic_data_type_element): sequence() {*this = basic_data_type_element;}
  sequence(const long int basic_data_type_element): sequence() {*this = basic_data_type_element;}
  sequence(const unsigned char basic_data_type_element): sequence() {*this = basic_data_type_element;}
  sequence(const unsigned short int basic_data_type_element): sequence() {*this = basic_data_type_element;}
  sequence(const unsigned int basic_data_type_element): sequence() {*this = basic_data_type_element;}
  sequence(const unsigned long int basic_data_type_element): sequence() {*this = basic_data_type_element;}
  sequence(const float basic_data_type_element): sequence() {*this = basic_data_type_element;}
  
//  operator bool(){return (bool) *(double*) get();}
//  operator char(){return (char) *(double*) get();}
//  operator short int(){return (short int) *(double*) get();}
//  operator int(){return (int) *(double*) get();}
//  operator long int(){return (long int) *(double*) get();}
//  operator unsigned char(){return (unsigned char) *(double*) get();}
//  operator unsigned short int(){return (unsigned short int) *(double*) get();}
//  operator unsigned int(){return (unsigned int) *(double*) get();}
//  operator unsigned long int(){return (unsigned long int) *(double*) get();}
//  operator float(){return (float) *(double*) get();}
  
  operator bool() const {return (bool) *(double*) get();}
  operator char() const {return (char) *(double*) get();}
  operator short int() const {return (short int) *(double*) get();}
  operator int() const {return (int) *(double*) get();}
  operator long int() const {return (long int) *(double*) get();}
  operator unsigned char() const {return (unsigned char) *(double*) get();}
  operator unsigned short int() const {return (unsigned short int) *(double*) get();}
  operator unsigned int() const {return (unsigned int) *(double*) get();}
  operator unsigned long int() const {return (unsigned long int) *(double*) get();}
  operator float() const {return (float) *(double*) get();}
  
  sequence& operator=(const bool basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  sequence& operator=(const char basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  sequence& operator=(const short int basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  sequence& operator=(const int basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  sequence& operator=(const long int basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  sequence& operator=(const unsigned char basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  sequence& operator=(const unsigned short int basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  sequence& operator=(const unsigned int basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  sequence& operator=(const unsigned long int basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  sequence& operator=(const float basic_data_type_element){*this = (double) basic_data_type_element; return *this;}
  
  bool operator==(const bool basic_data_type_element) const {return ((bool) *this == basic_data_type_element);}
  bool operator==(const char basic_data_type_element) const {return ((char) *this == basic_data_type_element);}
  bool operator==(const short int basic_data_type_element) const {return ((short int) *this == basic_data_type_element);}
  bool operator==(const int basic_data_type_element) const {return ((int) *this == basic_data_type_element);}
  bool operator==(const long int basic_data_type_element) const {return ((long int) *this == basic_data_type_element);}
  bool operator==(const unsigned char basic_data_type_element) const {return ((unsigned char) *this == basic_data_type_element);}
  bool operator==(const unsigned short int basic_data_type_element) const {return ((unsigned short int) *this == basic_data_type_element);}
  bool operator==(const unsigned int basic_data_type_element) const {return ((unsigned int) *this == basic_data_type_element);}
  bool operator==(const unsigned long int basic_data_type_element) const {return ((unsigned long int) *this == basic_data_type_element);}
  bool operator==(const float basic_data_type_element) const {return ((float) *this == basic_data_type_element);}
  bool operator!=(const bool basic_data_type_element) const {return !operator==(basic_data_type_element);}
  bool operator!=(const char basic_data_type_element) const {return !operator==(basic_data_type_element);}
  bool operator!=(const short int basic_data_type_element) const {return !operator==(basic_data_type_element);}
  bool operator!=(const int basic_data_type_element) const {return !operator==(basic_data_type_element);}
  bool operator!=(const long int basic_data_type_element) const {return !operator==(basic_data_type_element);}
  bool operator!=(const unsigned char basic_data_type_element) const {return !operator==(basic_data_type_element);}
  bool operator!=(const unsigned short int basic_data_type_element) const {return !operator==(basic_data_type_element);}
  bool operator!=(const unsigned int basic_data_type_element) const {return !operator==(basic_data_type_element);}
  bool operator!=(const unsigned long int basic_data_type_element) const {return !operator==(basic_data_type_element);}
  bool operator!=(const float basic_data_type_element) const {return !operator==(basic_data_type_element);}
  
// SERVICE ---------------------------------------------------------------------
public:
  // todo ask loader to validate pointer
  sequence(const service* srv): sequence() {*this = srv;}
  sequence(const sequence& ldr_params, const sequence& srv_params);
  sequence& operator=(const service* srv){*this = (void*) srv; type_set(sequence_type::service); return *this;}
  
  bool is_service() const {return type() == sequence_type::service;}
  bool is_service_valid() const;
  bool service_validate();
  
  operator service&(){return *(service*)(void*) (*this);}
  operator service*(){return (service*)(void*) (*this);}
  
  operator service&() const {return *(service*)(void*) (*this);}
  operator service*() const {return (service*)(void*) (*this);}
  
  service& operator*(){return *(service*)(void*) (*this);}
  service* operator->(){return (service*)(void*) (*this);}
  
// OPERATION -------------------------------------------------------------------
public:
  sequence op();
  sequence operator()(){return op();}
  
// ADVANCED CONVERSIONS --------------------------------------------------------
public:
  // conversion - parsing
  std::string to_string() const;
  sequence& from_string(const char* str);
};

#endif	// _SEQUENCE_H
