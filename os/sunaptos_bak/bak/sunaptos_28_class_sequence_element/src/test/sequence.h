#ifndef _SEQUENCE_H
#define	_SEQUENCE_H

#include <vector>
#include <sstream>
using namespace std;
#include "debug.h"

//typedef char element;
typedef bool element;

//enum class sequence_type
//{
//  unspecified_pointer_t = -1,
//  unspecified_t = 0,
//  sequence_t = 1,
//  service_t = 2,
//  boolean_t = 100,
//  integer_t = 110,
//  floating_point_t = 120,
//  timestamp_t = 130,
//  date_t = 140,
//  character_t = 200,
//  string_ascii_t = 210,
//  string_utf_8_t = 220,
//  string_utf_16_t = 230,
//  email_t = 360,
//};
//typedef enum sequence_type sequence_type;

//class seq_type
class sequence_type
{
public:
  enum type
  {
    unspecified_pointer_t = -1,
    unspecified_t = 0,
    sequence_t = 1,
    service_t = 2,
    boolean_t = 100,
    integer_t = 110,
    floating_point_t = 120,
    timestamp_t = 130,
    date_t = 140,
    character_t = 200,
    string_ascii_t = 210,
    string_utf_8_t = 220,
    string_utf_16_t = 230,
    email_t = 360,
  };
};
//typedef enum seq_type::type sequence_type;

class sequence;
// reference to existing objects -> must have the same life scope!
class sequence_element
{
protected:
  bool is_seq;
  union
  {
    element* e;
    sequence* s;
  };
private:
//  sequence_element(): e(0), is_seq(false) {}
public:
//  sequence_element(element* element): e(element), is_seq(false) {}
//  sequence_element(sequence* sequence): s(sequence), is_seq(true) {}
  sequence_element(element& element);
  sequence_element(sequence& sequence);
  operator element*();
  operator sequence*();
  operator element&();
  operator sequence&();
//  sequence_element& operator=(element* element) {e = element; is_seq = false; return *this;}
//  sequence_element& operator=(sequence* sequence) {s = sequence; is_seq = true; return *this;}
  sequence_element& operator=(element& element);
  sequence_element& operator=(sequence& sequence);
//  sequence_element& operator=(element elem) {e = &elem; is_seq = false; return *this;}
//  sequence_element& operator=(sequence seq) {s = &seq; is_seq = true; return *this;}
  bool is_sequence();
  element& elem();
  sequence& seq();
};

// numbers are copied into the internal buffer, char* and sequence* are kept by references (char* should be copied and sequence* must have an option to choose to make a copy)
class sequence//: virtual public Streamable
{
protected:
  vector<sequence_element> vse;
//  sequence_type t;
  sequence_type::type t;
  element b[sizeof(long double)];

public:
  // constructor and destructor
  sequence();
  virtual ~sequence();
  
  // copy
//  sequence(sequence& seq);
//  sequence(const sequence& seq);
//  sequence& operator=(sequence e);
//  sequence& operator=(sequence& e);
//  sequence& copy(sequence& e);
  
  // type conversions
  sequence(int e);
  sequence(long e);
  sequence(long long e);
  sequence(float e);
  sequence(double e);
  sequence(long double e);
  sequence(const char* e);

  operator int();
  operator long();
  operator long long();
  operator float();
  operator double();
  operator long double();
  operator const char*();

  sequence& operator=(int e);
  sequence& operator=(long e);
  sequence& operator=(long long e);
  sequence& operator=(float e);
  sequence& operator=(double e);
  sequence& operator=(long double e);
  sequence& operator=(const char* e);
  
  // access
//  sequence_element& get(sequence& i);
  sequence_element& get(sequence i);
  sequence& del(sequence& i);
  
//  void resize(sequence& size);
  void resize(sequence size);
  sequence size();
//  type type();
//  void set_type(type type);
  char* text();
};

#endif	// _SEQUENCE_H
