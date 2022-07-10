#ifndef CASTABLEBASICDATATYPES_H
#define	CASTABLEBASICDATATYPES_H

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

template <typename C>
class CastableBasicDataTypes: virtual public C
{
public:
//  using C::get;
//  using C::set;
//  
//  using C::C;
//  using C::operator=;
//  using C::operator->;
  
protected:
  BasicDataTypes t;

public:
  CastableBasicDataTypes(): C() {t = BasicDataTypes::type_undefined;}
  virtual ~CastableBasicDataTypes(){}

  CastableBasicDataTypes(const bool e): CastableBasicDataTypes() {operator=(e);}
  CastableBasicDataTypes(const char e): CastableBasicDataTypes() {operator=(e);}
  CastableBasicDataTypes(const short int e): CastableBasicDataTypes() {operator=(e);}
  CastableBasicDataTypes(const int e): CastableBasicDataTypes() {operator=(e);}
  CastableBasicDataTypes(const long int e): CastableBasicDataTypes() {operator=(e);}
  CastableBasicDataTypes(const long long int e): CastableBasicDataTypes() {operator=(e);}
  CastableBasicDataTypes(const unsigned char e): CastableBasicDataTypes() {operator=(e);}
  CastableBasicDataTypes(const unsigned short int e): CastableBasicDataTypes() {operator=(e);}
  CastableBasicDataTypes(const unsigned int e): CastableBasicDataTypes() {operator=(e);}
  CastableBasicDataTypes(const unsigned long int e): CastableBasicDataTypes() {operator=(e);}
  CastableBasicDataTypes(const unsigned long long int e): CastableBasicDataTypes() {operator=(e);}
  CastableBasicDataTypes(const float e): CastableBasicDataTypes() {operator=(e);}
  CastableBasicDataTypes(const double e): CastableBasicDataTypes() {operator=(e);}
  CastableBasicDataTypes(const long double e): CastableBasicDataTypes() {operator=(e);}
  CastableBasicDataTypes(const void* e): CastableBasicDataTypes() {operator=(e);}
  CastableBasicDataTypes(const wchar_t e): CastableBasicDataTypes() {operator=(e);}
  CastableBasicDataTypes(const char* e): CastableBasicDataTypes() {operator=(e);}
  CastableBasicDataTypes(const wchar_t* e): CastableBasicDataTypes() {operator=(e);}

  operator bool(){return *(bool*) C::operator->()->get();}
  operator char(){return *(char*) C::operator->()->get();}
  operator short int(){return *(short int*) C::operator->()->get();}
  operator int(){return *(int*) C::operator->()->get();}
  operator long int(){return *(long int*) C::operator->()->get();}
  operator long long int(){return *(long long int*) C::operator->()->get();}
  operator unsigned char(){return *(unsigned char*) C::operator->()->get();}
  operator unsigned short int(){return *(unsigned short int*) C::operator->()->get();}
  operator unsigned int(){return *(unsigned int*) C::operator->()->get();}
  operator unsigned long int(){return *(unsigned long int*) C::operator->()->get();}
  operator unsigned long long int(){return *(unsigned long long int*) C::operator->()->get();}
  operator float(){return *(float*) C::operator->()->get();}
  operator double(){return *(double*) C::operator->()->get();}
  operator long double(){return *(long double*) C::operator->()->get();}
  operator void*(){return *(void**) C::operator->()->get();}
  operator wchar_t(){return *(wchar_t*) C::operator->()->get();}
  operator char*(){return (char*) C::operator->()->get();}
  operator wchar_t*(){return (wchar_t*) C::operator->()->get();}

  operator bool() const {return *(bool*) C::operator->()->get();}
  operator char() const {return *(char*) C::operator->()->get();}
  operator short int() const {return *(short int*) C::operator->()->get();}
  operator int() const {return *(int*) C::operator->()->get();}
  operator long int() const {return *(long int*) C::operator->()->get();}
  operator long long int() const {return *(long long int*) C::operator->()->get();}
  operator unsigned char() const {return *(unsigned char*) C::operator->()->get();}
  operator unsigned short int() const {return *(unsigned short int*) C::operator->()->get();}
  operator unsigned int() const {return *(unsigned int*) C::operator->()->get();}
  operator unsigned long int() const {return *(unsigned long int*) C::operator->()->get();}
  operator unsigned long long int() const {return *(unsigned long long int*) C::operator->()->get();}
  operator float() const {return *(float*) C::operator->()->get();}
  operator double() const {return *(double*) C::operator->()->get();}
  operator long double() const {return *(long double*) C::operator->()->get();}
  operator void*() const {return *(void**) C::operator->()->get();}
  operator wchar_t() const {return *(wchar_t*) C::operator->()->get();}
  operator char*() const {return (char*) C::operator->()->get();}
  operator wchar_t*() const {return (wchar_t*) C::operator->()->get();}

  CastableBasicDataTypes& operator=(bool e){t = BasicDataTypes::type_bool; C::operator->()->set(&e, sizeof(bool)); return *this;}
  CastableBasicDataTypes& operator=(char e){t = BasicDataTypes::type_char; C::operator->()->set(&e, sizeof(char)); return *this;}
  CastableBasicDataTypes& operator=(short int e){t = BasicDataTypes::type_short_int; C::operator->()->set(&e, sizeof(short int)); return *this;}
  CastableBasicDataTypes& operator=(int e){t = BasicDataTypes::type_int; C::operator->()->set(&e, sizeof(int)); return *this;}
  CastableBasicDataTypes& operator=(long int e){t = BasicDataTypes::type_long_int; C::operator->()->set(&e, sizeof(long int)); return *this;}
  CastableBasicDataTypes& operator=(long long int e){t = BasicDataTypes::type_long_long_int; C::operator->()->set(&e, sizeof(long long int)); return *this;}
  CastableBasicDataTypes& operator=(unsigned char e){t = BasicDataTypes::type_unsigned_char; C::operator->()->set(&e, sizeof(unsigned char)); return *this;}
  CastableBasicDataTypes& operator=(unsigned short int e){t = BasicDataTypes::type_unsigned_short_int; C::operator->()->set(&e, sizeof(unsigned short int)); return *this;}
  CastableBasicDataTypes& operator=(unsigned int e){t = BasicDataTypes::type_unsigned_int; C::operator->()->set(&e, sizeof(unsigned int)); return *this;}
  CastableBasicDataTypes& operator=(unsigned long int e){t = BasicDataTypes::type_unsigned_long_int; C::operator->()->set(&e, sizeof(unsigned long int)); return *this;}
  CastableBasicDataTypes& operator=(unsigned long long int e){t = BasicDataTypes::type_unsigned_long_long_int; C::operator->()->set(&e, sizeof(unsigned long long int)); return *this;}
  CastableBasicDataTypes& operator=(float e){t = BasicDataTypes::type_float; C::operator->()->set(&e, sizeof(float)); return *this;}
  CastableBasicDataTypes& operator=(double e){t = BasicDataTypes::type_double; C::operator->()->set(&e, sizeof(double)); return *this;}
  CastableBasicDataTypes& operator=(long double e){t = BasicDataTypes::type_long_double; C::operator->()->set(&e, sizeof(long double)); return *this;}
  CastableBasicDataTypes& operator=(void* e){t = BasicDataTypes::type_void_pointer; C::operator->()->set(&e, sizeof(void*)); return *this;}
  CastableBasicDataTypes& operator=(wchar_t e){t = BasicDataTypes::type_wchar_t; C::operator->()->set(&e, sizeof(wchar_t)); return *this;}

  CastableBasicDataTypes& operator=(char* e){t = BasicDataTypes::type_char_pointer; C::operator->()->set(e, strlen(e)); return *this;}
  CastableBasicDataTypes& operator=(wchar_t* e){t = BasicDataTypes::type_wchar_t_pointer; C::operator->()->set(e, wcslen(e) * sizeof(wchar_t)); return *this;}

  CastableBasicDataTypes& operator=(const char* e){t = BasicDataTypes::type_char_pointer; C::operator->()->set(e, strlen(e)); return *this;}
  CastableBasicDataTypes& operator=(const wchar_t* e){t = BasicDataTypes::type_wchar_t_pointer; C::operator->()->set(e, wcslen(e) * sizeof(wchar_t)); return *this;}

  BasicDataTypes type() const {return t;}
  void type_set(BasicDataTypes type){t = type;}
};

#endif	/* CASTABLEBASICDATATYPES_H */
