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

class Service;
class SequenceNode;

typedef SequenceNode Sequence;
typedef Sequence sequence;
typedef sequence seq;

//------------------------------------------------------------------------------

enum class StandardDataTypes: int
{
  undefined = 0,
  number = 1,
  string = 2,
  sequence_dynamic = 100,
  sequence_executable = 200,
  number_ieee754_single = 1100,
  number_ieee754_double = 1101,
  timestamp = 1200,
  date = 1201,
  string_utf_8 = 1300,
  string_utf_16 = 1301,
};

enum class SequenceOperation: char
{
  undefined = 0,
  del = 'd',
};

class SequenceNode
{
// COMMON ----------------------------------------------------------------------
protected:
  SequenceIndex* spcount;
  SequenceIndex sz;
  void* pb;
  std::vector<SequenceNode>* sequence_links;
  
  void destroy();
  SequenceNode& copy(const SequenceNode& sequence_node);
  SequenceNode& move(SequenceNode& sequence_node);
  SequenceNode& link(SequenceNode& sequence_node);
  
  const void* get() const {return (const void*) pb;}
  SequenceNode& set(const void* pbuf, const SequenceIndex& size);
  
public:
  SequenceNode(): spcount(new SequenceIndex(1)), sz(0), pb(0), sequence_links(new std::vector<SequenceNode>()) {resize(0);}
  virtual ~SequenceNode(){destroy();}
  
  bool operator==(const SequenceNode& sequence_node) const;
  bool operator!=(const SequenceNode& sequence_node) const {return !operator==(sequence_node);}
  
// CONTAINER -------------------------------------------------------------------
public:
  SequenceNode& resize(const SequenceIndex& size);
  SequenceIndex size() const {return sz;}
  element& operator[](const SequenceIndex& index){return ((char*) pb)[index];}
  const element& operator[](const SequenceIndex& index) const {return ((char*) pb)[index];}
  
  SequenceNode& del(const SequenceIndex& index, const SequenceIndex& size);
  SequenceNode& del(const SequenceIndex& index){return del(index, 1);}
  SequenceNode& del(){return del(sz - 1, 1);}
  
  SequenceNode& ins(const element& e, const SequenceIndex& index);
  SequenceNode& ins(const element& e){return ins(e, sz);}
  SequenceNode& ins(const SequenceNode& sequence_node, const SequenceIndex& index);
  SequenceNode& ins(const SequenceNode& sequence_node){return ins(sequence_node, sz);}
  
  SequenceNode& move(const SequenceIndex& index, const SequenceIndex& size, const SequenceIndex& new_index);
  
  SequenceNode sub(const SequenceIndex& index, const SequenceIndex& size){SequenceNode r; for(SequenceIndex i = 0; i < size; i++) r[i] = operator[](index + i); return r;}
  SequenceNode extract(const SequenceIndex& index, const SequenceIndex& size){SequenceNode r = std::move(sub(index, size)); del(index, size); return r;}
  
// LINKS (sequence_links) ------------------------------------------------------
public:
  SequenceNode& links_resize(const SequenceIndex& size){sequence_links->resize(size); return *this;}
  SequenceIndex links_size() const {return sequence_links->size();}
  SequenceNode& operator()(const SequenceIndex& index){return (*sequence_links)[index];}
  const SequenceNode& operator()(const SequenceIndex& index) const {return (*sequence_links)[index];}
  SequenceNode& links_get(const SequenceNode& sequence_node){SequenceNode* r = &((*this)(sequence_node(0))); for(SequenceIndex i = 1; i < sequence_node.links_size(); i++){r = &((*r)(sequence_node(i)));}; return *r;}
  
  SequenceNode& links_del(const SequenceIndex& index, const SequenceIndex& size){sequence_links->erase(sequence_links->begin() + index, sequence_links->begin() + size); return *this;}
  SequenceNode& links_del(const SequenceIndex& index){sequence_links->erase(sequence_links->begin() + index); return *this;}
  SequenceNode& links_del(){sequence_links->erase(sequence_links->end() - 1); return *this;}
  
  SequenceNode& links_ins(const SequenceNode& sequence_node, const SequenceIndex& index){sequence_links->insert(sequence_links->begin() + index, sequence_node); return *this;}
  SequenceNode& links_ins(SequenceNode&& sequence_node, const SequenceIndex& index){sequence_links->insert(sequence_links->begin() + index, std::move(sequence_node)); return *this;}
  SequenceNode& links_ins(SequenceNode* sequence_node, const SequenceIndex& index){sequence_links->insert(sequence_links->begin() + index, std::move((*sequence_node).link())); return *this;}
  SequenceNode& links_ins(const SequenceNode& sequence_node){sequence_links->push_back(sequence_node); return *this;}
  SequenceNode& links_ins(SequenceNode&& sequence_node){sequence_links->push_back(std::move(sequence_node)); return *this;}
  SequenceNode& links_ins(SequenceNode* sequence_node){sequence_links->push_back(std::move((*sequence_node).link())); return *this;}
  // to prevent interpreting integers as SequenceNode*
  template <typename T> SequenceNode& links_ins(const T& e, const SequenceIndex& index){return links_ins(SequenceNode(e), index);}
  template <typename T> SequenceNode& links_ins(const T& e){return links_ins(SequenceNode(e));}
  
//  SequenceNode& links_move(const SequenceIndex& index, const SequenceIndex& size, const SequenceIndex& new_index){buffer->move(index, size, new_index); return *this;}
  
// OPERATION -------------------------------------------------------------------
public:
  SequenceNode op();
//  SequenceNode op(const SequenceNode& sequence_node);
  SequenceNode operator()(){return op();}
  
// COPY MOVE LINK (copy, move, link) -------------------------------------------
public:
  SequenceNode(const SequenceNode& sequence_node): SequenceNode() {*this = sequence_node;}
  SequenceNode(SequenceNode&& sequence_node): SequenceNode() {*this = std::move(sequence_node);}
  SequenceNode(SequenceNode* sequence_node): SequenceNode() {*this = sequence_node;}
  
  SequenceNode& operator=(const SequenceNode& sequence_node){return copy(sequence_node);}
  SequenceNode& operator=(SequenceNode&& sequence_node){return move(sequence_node);}
  SequenceNode& operator=(SequenceNode* sequence_node){return link(*sequence_node);}
  
  SequenceNode link(){SequenceNode r; r.link(*this); return r;}
  
// BASIC DATA TYPES CAST (get, set) --------------------------------------------
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
  
  operator double(){return *(double*) get();}
  operator char*(){return (char*) get();}
  operator void*(){return (void*) get();}
  
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
  
  operator double() const {return *(double*) get();}
  operator char*() const {return (char*) get();}
  operator void*() const {return (void*) get();}
  
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
  
  SequenceNode& operator=(double basic_data_type_element){*this = std::move(SequenceNode()); set(&basic_data_type_element, sizeof(double)); (*this)[size()] = 1; return *this;}
  SequenceNode& operator=(const char* basic_data_type_element){*this = std::move(SequenceNode()); set(basic_data_type_element, strlen(basic_data_type_element)); return *this;}
  SequenceNode& operator=(const void* basic_data_type_element){*this = std::move(SequenceNode()); set(&basic_data_type_element, sizeof(void*)); (*this)[size()] = 2; return *this;}
  
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
  
  const double number() const {return (double) (*this);}
  const char* string() const {return (char*) (*this);}
  const void* pointer() const {return (void*) (*this);}
  
  double number(){return (double) (*this);}
  char* string(){return (char*) (*this);}
  void* pointer(){return (void*) (*this);}
  
  bool is_number() const {if(size() == sizeof(double)) return 1 == (*this)[size()]; else return false;}
  bool is_string() const {if(size() == sizeof(double)) return 0 == (*this)[size()]; else return false;}
  bool is_pointer() const {if(size() == sizeof(double)) return 2 == (*this)[size()]; else return false;}
  bool is_type() const {return 3 == (*this)[size()];}
  bool is_type_standard() const {return is_type() && is_number();}
  SequenceNode& type_set(StandardDataTypes standard_data_type){*this = (double) standard_data_type; (*this)[size()] = 3; return *this;}
  SequenceNode& type_set(const char* custom_data_type){*this = custom_data_type; return *this;}
  
// ADVANCED CONVERSIONS --------------------------------------------------------
public:
  // conversion - parsing
  std::string to_string() const;
  SequenceNode& from_string(const char* str);
  
  // conversion - service
  SequenceNode(const Service* srv): SequenceNode() {*this = srv;}
  SequenceNode(const SequenceNode& ldr_params, const SequenceNode& srv_params);
  SequenceNode& operator=(const Service* srv){*this = (void*) srv; (*this)[size()] = 4; return *this;}
  
  bool is_service() const {if(size() == sizeof(double)) return 4 == (*this)[size()]; else return false;}
  bool is_service_valid() const;
  bool service_validate();
  
  operator Service&(){return *(Service*)(void*) get();}
  operator Service*(){return (Service*)(void*) get();}
  
  operator Service&() const {return *(Service*)(void*) get();}
  operator Service*() const {return (Service*)(void*) get();}
  
  Service& operator*(){return *(Service*)(void*) get();}
  Service* operator->(){return (Service*)(void*) get();}
};

#endif	// _SEQUENCE_H
