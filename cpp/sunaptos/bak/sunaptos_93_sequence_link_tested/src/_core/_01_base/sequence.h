#ifndef _SEQUENCE_H
#define	_SEQUENCE_H

#include "debug.h"

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

class service;

//------------------------------------------------------------------------------

enum class sequence_type: unsigned char
{
  undefined = 0,
  number = 1,
  string = 2,
  pointer = 3,
  service = 4,
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

class sequence
{
// COMMON ----------------------------------------------------------------------
protected:
  SequenceIndex* spcount;
  SequenceIndex sz;
  void* pb;
  std::vector<sequence>* sequence_links;
  
public:
  void destroy();
  sequence& copy(const sequence& sequence_node);
  sequence& move(sequence& sequence_node);
  sequence& link(sequence& sequence_node);
  
  const void* get() const {return (const void*) pb;}
  sequence& set(const void* pbuf, const SequenceIndex& size);
  
public:
  sequence(): spcount(new SequenceIndex(1)), sz(0), pb(0), sequence_links(new std::vector<sequence>()) {resize(0);}
  virtual ~sequence(){destroy();}
  
  bool operator==(const sequence& sequence_node) const;
  bool operator!=(const sequence& sequence_node) const {return !operator==(sequence_node);}
  
// CONTAINER -------------------------------------------------------------------
public:
  sequence& resize(const SequenceIndex& size);
  SequenceIndex size() const {return sz;}
  element& operator[](const SequenceIndex& index){return ((char*) pb)[index];}
  const element& operator[](const SequenceIndex& index) const {return ((char*) pb)[index];}
  
  sequence& del(const SequenceIndex& index, const SequenceIndex& size);
  sequence& del(const SequenceIndex& index){return del(index, 1);}
  sequence& del(){return del(sz - 1, 1);}
  
  sequence& ins(const element& e, const SequenceIndex& index);
  sequence& ins(const element& e){return ins(e, sz);}
  sequence& ins(const sequence& sequence_node, const SequenceIndex& index);
  sequence& ins(const sequence& sequence_node){return ins(sequence_node, sz);}
  
  sequence& move(const SequenceIndex& index, const SequenceIndex& size, const SequenceIndex& new_index);
  
  sequence sub(const SequenceIndex& index, const SequenceIndex& size){sequence r; for(SequenceIndex i = 0; i < size; i++) r[i] = operator[](index + i); return r;}
  sequence extract(const SequenceIndex& index, const SequenceIndex& size){sequence r = std::move(sub(index, size)); del(index, size); return r;}
  
// LINKS (sequence_links) ------------------------------------------------------
public:
  sequence& links_resize(const SequenceIndex& size){sequence_links->resize(size); return *this;}
  SequenceIndex links_size() const {return sequence_links->size();}
  sequence& operator()(const SequenceIndex& index){return (*sequence_links)[index];}
  const sequence& operator()(const SequenceIndex& index) const {return (*sequence_links)[index];}
  sequence& links_get(const sequence& sequence_node){sequence* r = &((*this)(sequence_node(0))); for(SequenceIndex i = 1; i < sequence_node.links_size(); i++){r = &((*r)(sequence_node(i)));}; return *r;}
  
  sequence& links_del(const SequenceIndex& index, const SequenceIndex& size){sequence_links->erase(sequence_links->begin() + index, sequence_links->begin() + size); return *this;}
  sequence& links_del(const SequenceIndex& index){sequence_links->erase(sequence_links->begin() + index); return *this;}
  sequence& links_del(){sequence_links->erase(sequence_links->end() - 1); return *this;}
  
  sequence& links_ins(const sequence& sequence_node, const SequenceIndex& index){sequence_links->insert(sequence_links->begin() + index, sequence_node); return *this;}
  sequence& links_ins(sequence&& sequence_node, const SequenceIndex& index){sequence_links->insert(sequence_links->begin() + index, std::move(sequence_node)); return *this;}
  sequence& links_ins(sequence* sequence_node, const SequenceIndex& index){sequence_links->insert(sequence_links->begin() + index, std::move((*sequence_node).link())); return *this;}
  sequence& links_ins(const sequence& sequence_node){sequence_links->push_back(sequence_node); return *this;}
  sequence& links_ins(sequence&& sequence_node){sequence_links->push_back(std::move(sequence_node)); return *this;}
  sequence& links_ins(sequence* sequence_node){sequence_links->push_back(std::move((*sequence_node).link())); return *this;}
  // to prevent interpreting integers as sequence*
  template <typename T> sequence& links_ins(const T& e, const SequenceIndex& index){return links_ins(sequence(e), index);}
  template <typename T> sequence& links_ins(const T& e){return links_ins(sequence(e));}
  
//  sequence& links_move(const SequenceIndex& index, const SequenceIndex& size, const SequenceIndex& new_index){buffer->move(index, size, new_index); return *this;}
  
// OPERATION -------------------------------------------------------------------
public:
  sequence op();
  sequence operator()(){return op();}
  
// COPY MOVE LINK (copy, move, link) -------------------------------------------
public:
  sequence(const sequence& sequence_node): sequence() {*this = sequence_node;}
  sequence(sequence&& sequence_node): sequence() {*this = std::move(sequence_node);}
  sequence(sequence* sequence_node): sequence() {*this = sequence_node;}
  
  sequence& operator=(const sequence& sequence_node){return copy(sequence_node);}
  sequence& operator=(sequence&& sequence_node){return move(sequence_node);}
  sequence& operator=(sequence* sequence_node){return link(*sequence_node);}
  
  sequence link(){sequence r; r.link(*this); return r;}
  
// BASIC DATA TYPES CAST (get, set) --------------------------------------------
  sequence(const double basic_data_type_element): sequence() {*this = basic_data_type_element;}
  sequence(const char* basic_data_type_element): sequence() {*this = basic_data_type_element;}
  sequence(const void* basic_data_type_element): sequence() {*this = basic_data_type_element;}
  
  operator double(){return *(double*) get();}
  operator char*(){return (char*) get();}
  operator void*(){return *(void**) get();}
  
  operator double() const {return *(double*) get();}
  operator char*() const {return (char*) get();}
  operator void*() const {return *(void**) get();}
  
  sequence& operator=(const double basic_data_type_element){*this = std::move(sequence()); set(&basic_data_type_element, sizeof(double)); type() = sequence_type::number_ieee754_double; return *this;}
  sequence& operator=(const char* basic_data_type_element){*this = std::move(sequence()); set(basic_data_type_element, strlen(basic_data_type_element)); return *this;}
  sequence& operator=(const void* basic_data_type_element){*this = std::move(sequence()); set(&basic_data_type_element, sizeof(void*)); type() = sequence_type::pointer; return *this;}
  
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
  
  operator bool(){return (bool) *(double*) get();}
  operator char(){return (char) *(double*) get();}
  operator short int(){return (short int) *(double*) get();}
  operator int(){return (int) *(double*) get();}
  operator long int(){return (long int) *(double*) get();}
  operator unsigned char(){return (unsigned char) *(double*) get();}
  operator unsigned short int(){return (unsigned short int) *(double*) get();}
  operator unsigned int(){return (unsigned int) *(double*) get();}
  operator unsigned long int(){return (unsigned long int) *(double*) get();}
  operator float(){return (float) *(double*) get();}
  
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
  
  sequence_type& type(){return (sequence_type&)(*this)[sz];}
  const sequence_type& type() const {return (sequence_type&)(*this)[sz];}
  
  sequence& type_custom_set(const double custom_data_type){*this = custom_data_type; type() = sequence_type::custom; return *this;}
  sequence& type_custom_set(const char* custom_data_type){*this = custom_data_type; type() = sequence_type::custom; return *this;}
  
  bool is_undefined() const {return type() == sequence_type::undefined;}
  
// ADVANCED CONVERSIONS --------------------------------------------------------
public:
  // conversion - parsing
  std::string to_string() const;
  sequence& from_string(const char* str);
  
  // conversion - service
  sequence(const service* srv): sequence() {*this = srv;}
  sequence(const sequence& ldr_params, const sequence& srv_params);
  sequence& operator=(const service* srv){*this = (void*) srv; type() = sequence_type::service; return *this;}
  
  bool is_service() const {return type() == sequence_type::service;}
  bool is_service_valid() const;
  bool service_validate();
  
  operator service&(){return *(service*)(void*) (*this);}
  operator service*(){return (service*)(void*) (*this);}
  
  operator service&() const {return *(service*)(void*) (*this);}
  operator service*() const {return (service*)(void*) (*this);}
  
  service& operator*(){return *(service*)(void*) (*this);}
  service* operator->(){return (service*)(void*) (*this);}
};

#endif	// _SEQUENCE_H
