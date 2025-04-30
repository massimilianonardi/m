#ifndef _BUFFER_H
#define	_BUFFER_H

#include <cstdlib>
#include <cstring>
#include <cwchar>
#include <utility>

typedef int buffer_index;

enum class BasicDataTypes: char
{
  type_undefined = 0,
  type_bool = 1,
  type_char = 2,
  type_short_int = 3,
  type_int = 4,
  type_long_int = 5,
  type_long_long_int = 6,
  type_unsigned_char = 7,
  type_unsigned_short_int = 8,
  type_unsigned_int = 9,
  type_unsigned_long_int = 10,
  type_unsigned_long_long_int = 11,
  type_float = 12,
  type_double = 13,
  type_long_double = 14,
  type_void_pointer = 15,
  type_wchar_t = 16,
  type_char_pointer = 17,
  type_wchar_t_pointer = 18
};

class Buffer
{
protected:
  buffer_index sz;
  void* pb;
  BasicDataTypes t;

public:
  Buffer(): pb(0), sz(0), t(BasicDataTypes::type_undefined) {}
  Buffer(const buffer_index& size): Buffer() {resize(size);}
  Buffer(const void* pbuf, const buffer_index& size): Buffer() {set(pbuf, size);}
  virtual ~Buffer(){free(pb); pb = 0;}
  
  Buffer(const Buffer& b): Buffer() {*this = b;}
  Buffer(Buffer&& b): Buffer() {*this ^ b;}
  Buffer(const Buffer* b): Buffer() {*this | *b;}
  Buffer& operator=(const Buffer& b){return copy(b);}
  Buffer& operator=(Buffer&& b){return move(b);}
  Buffer& operator^(Buffer& b){return move(b);}
  Buffer& operator|(const Buffer& b){return link(b);}
  Buffer& copy(const Buffer& b){if(&b != this){t = b.t; set(b.pb, b.sz);}; return *this;}
  Buffer& move(Buffer& b){if(&b != this){t = b.t; pb = b.pb; sz = b.sz; b.t = BasicDataTypes::type_undefined; b.pb = 0; b.sz = 0;}; return *this;}
  Buffer& link(const Buffer& b){if(&b != this){t = b.t; pb = b.pb; sz = b.sz;}; return *this;}
  // todo shared pointer for linking

  const void* get() const {return (const void*) pb;}
  Buffer& set(const void* pbuf, const buffer_index& size);
  Buffer& ins(const void* pbuf, const buffer_index& size, const buffer_index& index);
  Buffer& del(const buffer_index& index, const buffer_index& size);
  Buffer& move(const buffer_index& index, const buffer_index& size, const buffer_index& new_index);

  Buffer& resize(const buffer_index& size);
  buffer_index size() const {return sz;}
  char& get(const buffer_index& index){return ((char*) get())[index];}
  
  bool operator==(const Buffer& b) const;
  bool operator!=(const Buffer& b) const {return !operator==(b);}
  char& operator[](const buffer_index& index) const {return ((char*) get())[index];}
  Buffer& operator<<(const Buffer& b){ins(b.pb, b.sz, sz); return *this;}
  Buffer& operator>>(const Buffer& b){; return *this;}
//  Buffer& operator<<=(const Buffer& b){; return *this;}
//  Buffer& operator>>=(const Buffer& b){; return *this;}
  
  template <typename T> Buffer(T e): Buffer() {*this = e;}

  operator bool() const {return *(bool*) get();}
  operator char() const {return *(char*) get();}
  operator short int() const {return *(short int*) get();}
  operator int() const {return *(int*) get();}
  operator long int() const {return *(long int*) get();}
  operator long long int() const {return *(long long int*) get();}
  operator unsigned char() const {return *(unsigned char*) get();}
  operator unsigned short int() const {return *(unsigned short int*) get();}
  operator unsigned int() const {return *(unsigned int*) get();}
  operator unsigned long int() const {return *(unsigned long int*) get();}
  operator unsigned long long int() const {return *(unsigned long long int*) get();}
  operator float() const {return *(float*) get();}
  operator double() const {return *(double*) get();}
  operator long double() const {return *(long double*) get();}
  operator void*() const {return *(void**) get();}
  operator wchar_t() const {return *(wchar_t*) get();}
  operator char*() const {return (char*) get();}
  operator wchar_t*() const {return (wchar_t*) get();}

  Buffer& operator=(bool e){t = BasicDataTypes::type_bool; set(&e, sizeof(bool)); return *this;}
  Buffer& operator=(char e){t = BasicDataTypes::type_char; set(&e, sizeof(char)); return *this;}
  Buffer& operator=(short int e){t = BasicDataTypes::type_short_int; set(&e, sizeof(short int)); return *this;}
  Buffer& operator=(int e){t = BasicDataTypes::type_int; set(&e, sizeof(int)); return *this;}
  Buffer& operator=(long int e){t = BasicDataTypes::type_long_int; set(&e, sizeof(long int)); return *this;}
  Buffer& operator=(long long int e){t = BasicDataTypes::type_long_long_int; set(&e, sizeof(long long int)); return *this;}
  Buffer& operator=(unsigned char e){t = BasicDataTypes::type_unsigned_char; set(&e, sizeof(unsigned char)); return *this;}
  Buffer& operator=(unsigned short int e){t = BasicDataTypes::type_unsigned_short_int; set(&e, sizeof(unsigned short int)); return *this;}
  Buffer& operator=(unsigned int e){t = BasicDataTypes::type_unsigned_int; set(&e, sizeof(unsigned int)); return *this;}
  Buffer& operator=(unsigned long int e){t = BasicDataTypes::type_unsigned_long_int; set(&e, sizeof(unsigned long int)); return *this;}
  Buffer& operator=(unsigned long long int e){t = BasicDataTypes::type_unsigned_long_long_int; set(&e, sizeof(unsigned long long int)); return *this;}
  Buffer& operator=(float e){t = BasicDataTypes::type_float; set(&e, sizeof(float)); return *this;}
  Buffer& operator=(double e){t = BasicDataTypes::type_double; set(&e, sizeof(double)); return *this;}
  Buffer& operator=(long double e){t = BasicDataTypes::type_long_double; set(&e, sizeof(long double)); return *this;}
  Buffer& operator=(void* e){t = BasicDataTypes::type_void_pointer; set(&e, sizeof(void*)); return *this;}
  Buffer& operator=(wchar_t e){t = BasicDataTypes::type_wchar_t; set(&e, sizeof(wchar_t)); return *this;}
  
  Buffer& operator=(char* e){t = BasicDataTypes::type_char_pointer; set(e, strlen(e)); return *this;}
  Buffer& operator=(wchar_t* e){t = BasicDataTypes::type_wchar_t_pointer; set(e, wcslen(e) * sizeof(wchar_t)); return *this;}

  Buffer& operator=(const char* e){t = BasicDataTypes::type_char_pointer; set(e, strlen(e)); return *this;}
  Buffer& operator=(const wchar_t* e){t = BasicDataTypes::type_wchar_t_pointer; set(e, wcslen(e) * sizeof(wchar_t)); return *this;}
  
  BasicDataTypes type() const {return t;}
  void type_set(BasicDataTypes type){t = type;}
};

//------------------------------------------------------------------------------

// BASIC DATA TYPES:
//bool
//char
//short int
//int
//long int
//long long int
//unsigned char
//unsigned short int
//unsigned int
//unsigned long int
//unsigned long long int
//float
//double
//long double
//void*
//wchar_t
//char*
//wchar_t*

// DATA TYPES ENUMERATION:
//type_bool
//type_char
//type_short_int
//type_int
//type_long_int
//type_long_long_int
//type_unsigned_char
//type_unsigned_short_int
//type_unsigned_int
//type_unsigned_long_int
//type_unsigned_long_long_int
//type_float
//type_double
//type_long_double
//type_void_pointer
//type_wchar_t
//type_char_pointer
//type_wchar_t_pointer

#endif	// _BUFFER_H
