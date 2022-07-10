#ifndef SEQUENCE_REFERENCE_H
#define SEQUENCE_REFERENCE_H

#include "pointer_shared.h"
#include "buffer.h"

typedef char element;
typedef long index;

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

typedef sequence_data std::shared_ptr<buffer>;

class sequence_reference
{
protected:
  sequence_data data;
  
  void create(){data = sequence_data(new buffer());}
  void destroy(){delete data;}
  sequence_reference& copy(const sequence_reference& sequence_node);
  sequence_reference& move(sequence_reference& sequence_node);
  sequence_reference& link(sequence_reference& sequence_node);
  
public:
  sequence_reference(){create();}
  virtual ~sequence_reference(){destroy();}
  
  sequence_reference& operator=(const sequence_reference& sequence_node){return copy(sequence_node);}
  sequence_reference& operator=(sequence_reference&& sequence_node){return move(sequence_node);}
  sequence_reference& operator=(sequence_reference* sequence_node){return link(*sequence_node);}
  
  // compares only data
  bool operator==(const sequence_reference& sequence_node) const {return (data_ptr->data == sequence_node.data_ptr->data) && (data_ptr->links == sequence_node.data_ptr->links);}
  bool operator!=(const sequence_reference& sequence_node) const {return !operator==(sequence_node);}
  // compares data (implicitly) and link
  bool operator==(const sequence_reference* sequence_node) const {return data_ptr == sequence_node->data_ptr;}
  bool operator!=(const sequence_reference* sequence_node) const {return !operator==(sequence_node);}
  
  sequence_reference& unlink(){sequence_reference tmp = *this; destroy(); create(); *this = std::move(tmp); return *this;}
};

#endif
