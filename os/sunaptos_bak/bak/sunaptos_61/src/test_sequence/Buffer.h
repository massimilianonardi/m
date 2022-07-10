#ifndef _BUFFER_H
#define	_BUFFER_H

#include <cstring>
#include <cwchar>

class Buffer
{
protected:
  long sz;
  void* pb;

public:
  Buffer();
  Buffer(long size);
  Buffer(const void* pbuf, long size);
  virtual ~Buffer();
  
  Buffer(const Buffer& b);
  Buffer& operator=(const Buffer& b);

  long size() const;
  void resize(long size);
  const void* get() const;
  void set(const void* pbuf, long size);

  bool operator==(const Buffer& b) const;
  bool operator!=(const Buffer& b) const {return !operator==(b);}
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

enum class BasicDataTypes: char
{
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

class BufferBasicDataTypes: virtual public Buffer
{
protected:
  BasicDataTypes t;
  
public:
  BufferBasicDataTypes(){}
  virtual ~BufferBasicDataTypes(){}
  
  template <typename T> BufferBasicDataTypes(T e){*this = e;}

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

  BufferBasicDataTypes& operator=(bool e){t = BasicDataTypes::type_bool; set(&e, sizeof(bool)); return *this;}
  BufferBasicDataTypes& operator=(char e){t = BasicDataTypes::type_char; set(&e, sizeof(char)); return *this;}
  BufferBasicDataTypes& operator=(short int e){t = BasicDataTypes::type_short_int; set(&e, sizeof(short int)); return *this;}
  BufferBasicDataTypes& operator=(int e){t = BasicDataTypes::type_int; set(&e, sizeof(int)); return *this;}
  BufferBasicDataTypes& operator=(long int e){t = BasicDataTypes::type_long_int; set(&e, sizeof(long int)); return *this;}
  BufferBasicDataTypes& operator=(long long int e){t = BasicDataTypes::type_long_long_int; set(&e, sizeof(long long int)); return *this;}
  BufferBasicDataTypes& operator=(unsigned char e){t = BasicDataTypes::type_unsigned_char; set(&e, sizeof(unsigned char)); return *this;}
  BufferBasicDataTypes& operator=(unsigned short int e){t = BasicDataTypes::type_unsigned_short_int; set(&e, sizeof(unsigned short int)); return *this;}
  BufferBasicDataTypes& operator=(unsigned int e){t = BasicDataTypes::type_unsigned_int; set(&e, sizeof(unsigned int)); return *this;}
  BufferBasicDataTypes& operator=(unsigned long int e){t = BasicDataTypes::type_unsigned_long_int; set(&e, sizeof(unsigned long int)); return *this;}
  BufferBasicDataTypes& operator=(unsigned long long int e){t = BasicDataTypes::type_unsigned_long_long_int; set(&e, sizeof(unsigned long long int)); return *this;}
  BufferBasicDataTypes& operator=(float e){t = BasicDataTypes::type_float; set(&e, sizeof(float)); return *this;}
  BufferBasicDataTypes& operator=(double e){t = BasicDataTypes::type_double; set(&e, sizeof(double)); return *this;}
  BufferBasicDataTypes& operator=(long double e){t = BasicDataTypes::type_long_double; set(&e, sizeof(long double)); return *this;}
  BufferBasicDataTypes& operator=(void* e){t = BasicDataTypes::type_void_pointer; set(&e, sizeof(void*)); return *this;}
  BufferBasicDataTypes& operator=(wchar_t e){t = BasicDataTypes::type_wchar_t; set(&e, sizeof(wchar_t)); return *this;}
  
  BufferBasicDataTypes& operator=(char* e){t = BasicDataTypes::type_char_pointer; set(e, strlen(e) + 1); return *this;}
  BufferBasicDataTypes& operator=(wchar_t* e){t = BasicDataTypes::type_wchar_t_pointer; set(e, (wcslen(e) + 1) * sizeof(wchar_t)); return *this;}

  BufferBasicDataTypes& operator=(const char* e){t = BasicDataTypes::type_char_pointer; set(e, strlen(e) + 1); return *this;}
  BufferBasicDataTypes& operator=(const wchar_t* e){t = BasicDataTypes::type_wchar_t_pointer; set(e, (wcslen(e) + 1) * sizeof(wchar_t)); return *this;}
  
  BasicDataTypes type(){return t;}
  void type_set(BasicDataTypes type){t = type;}
};

#endif	// _BUFFER_H
