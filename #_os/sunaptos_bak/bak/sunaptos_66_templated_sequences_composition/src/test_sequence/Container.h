#ifndef CONTAINER_H
#define	CONTAINER_H

#include <memory>
#include <utility>
//#include <type_traits>

// CONTAINER: provides advanced features for a basic container C.
// T must provide the copy, move and link operators as follows:
//   T& operator=(const T& b);
//   T& operator=(T&& b);
//   T& operator=(const T* b);
// I must provide + - == != < > <= >=
// C must have the following interface:
//   void resize(const I& size);
//   I size() const;
//   T& operator[](const I& index) const;
//   or T& operator[](const I& index);
template <typename T, typename I, typename C>
class Container: virtual public C
{
public:
//  using C::resize;
//  using C::size;
//  using C::operator[];
  
//  using C::C;
//  using C::operator=;
//  using C::operator*;
  
public:
//  Container(): C() {}
  virtual ~Container(){}

  Container& resize(const I& size){dynamic_cast<C*>(this)->operator->()->resize(size); return *this;}
  I size() const {return dynamic_cast<const C*>(this)->operator->()->size();}
  const T& get(const I& index) const {return dynamic_cast<const C*>(this)->operator->()->operator[](index);}
  T& get(const I& index){return dynamic_cast<C*>(this)->operator->()->operator[](index);}
  
  const T& operator[](const I& index) const {return get(index);}
  T& operator[](const I& index){return get(index);}
  void copy(T& source, T& destination){destination = source;}
  void move(T& source, T& destination){destination = std::move(source);}
  void link(T& source, T& destination){static_assert(std::is_member_function_pointer<decltype(&T::link)>::value, "class is not capable of copy/move/link!"); destination.link(source);}
  
//  Container& del(const I& index){for(I i = index + 1; i < size(); i++) get(i - 1) = get(i); resize(size() - 1); return *this;}
  Container& ins(const T& e, const I& index){resize(size() + 1);for(I i = size() - 1; index < i; i--) move(get(i - 1), get(i)); copy(e, get(index)); return *this;}
  Container& ins(T&& e, const I& index){resize(size() + 1);for(I i = size() - 1; index < i; i--) move(get(i - 1), get(i)); move(e, get(index)); return *this;}
  Container& ins(const T* e, const I& index){resize(size() + 1);for(I i = size() - 1; index < i; i--) move(get(i - 1), get(i)); link(e, get(index)); return *this;}
//  Container& move(const I& index, const I& new_index){T b = std::move(get(index)); get(index) = std::move(get(new_index)); get(new_index) = std::move(b); return *this;}
  
  Container& del(const I& index, const I& size){for(I i = 0; i < size; i++) del(index); return *this;}
//  Container& ins(const Container& b, const I& index){for(I i = 0; i < size; i++) ins(b.get(index + i)); return *this;}
//  Container& ins(Container&& b, const I& index){for(I i = 0; i < size; i++) ins(b.get(index + i)); return *this;}
//  Container& ins(const Container* b, const I& index){for(I i = 0; i < size; i++) ins(b.get(index + i)); return *this;}
//  Container& move(const I& index, const I& size, const I& new_index){for(I i = 0; i < size; i++) move(index + i, new_index + 1); return *this;}
//  T extract(const I& index) const {T b = std::move(get(index)); del(index); return b;}
//  Container extract(const I& index, const I& size){Container r; for(I i = 0; i < size; i++) r.get(i) = extract(index + i); return r;}
  Container sub(const I& index, const I& size){Container r; for(I i = 0; i < size; i++) copy(get(index + i), r.get(i)); return r;}
  
  Container& operator<<(T& b){resize(size() + 1); link(b, get(size() - 1)); return *this;}
  Container& operator<<(T&& b){resize(size() + 1); move(b, get(size() - 1)); return *this;}
  Container& operator>>(T& b){move(get(0), b); del(0, 1); return *this;}
  Container& operator<<=(const T& b){resize(size() + 1); copy(b, get(size() - 1)); return *this;}
  Container& operator>>=(T& b){return operator>>(b);}
  
  Container& operator<<(Container& b){for(I i = 0; i < b.size(); i++) (*this) << b[i]; return *this;}
  Container& operator>>(Container& b){for(I i = 0; i < b.size(); i++) (*this) >> b[i]; return *this;}
  Container& operator<<=(const Container& b){for(I i = 0; i < b.size(); i++) (*this) <<= b[i]; return *this;}
  Container& operator>>=(Container& b){for(I i = 0; i < b.size(); i++) (*this) >>= b[i]; return *this;}
};

template <typename C>
class CopyMoveLinkCapable
{
protected:
  std::shared_ptr<C> c;

public:
  CopyMoveLinkCapable(){c = std::shared_ptr<C>(new C());}
  virtual ~CopyMoveLinkCapable(){}
  
  virtual C& operator*(){return c.operator*();}
  virtual C* operator->(){return c.operator->();}
  virtual const C& operator*() const {return c.operator*();}
  virtual const C* operator->() const {return c.operator->();}
  
  bool operator==(const CopyMoveLinkCapable& b) const {return *c == *(b.c);}
  bool operator!=(const CopyMoveLinkCapable& b) const {return !operator==(b);}
  
  CopyMoveLinkCapable(const CopyMoveLinkCapable& b): CopyMoveLinkCapable() {*this = b;}
  CopyMoveLinkCapable(CopyMoveLinkCapable&& b): CopyMoveLinkCapable() {*this = b;}
//  CopyMoveLinkCapable(CopyMoveLinkCapable* b): CopyMoveLinkCapable() {*this = b;}
  CopyMoveLinkCapable& operator=(const CopyMoveLinkCapable& b){return copy(b);}
  CopyMoveLinkCapable& operator=(CopyMoveLinkCapable&& b){return move(b);}
//  Container& operator=(const Container* b){return link(b);}
//  Container& operator^(const Container& b){return link(b);}
//  Container& operator|(const Container& b){return link(b);}
//  Container& operator&(const Container& b){return link(b);}
  CopyMoveLinkCapable& copy(const CopyMoveLinkCapable& b){if(&b != this){*c = *b.c;}; return *this;}
  CopyMoveLinkCapable& move(CopyMoveLinkCapable&& b){if(&b != this){c = std::move(b.c);}; return *this;}
  CopyMoveLinkCapable& link(const CopyMoveLinkCapable& b){if(&b != this){c = b.c;}; return *this;}
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
  
public:
  CastableBasicDataTypes(): C() {t = BasicDataTypes::type_undefined;}
  virtual ~CastableBasicDataTypes(){}
  
protected:
  BasicDataTypes t;

public:
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

  operator bool(){return *(bool*) dynamic_cast<C*>(this)->operator->()->get();}
  operator char(){return *(char*) dynamic_cast<C*>(this)->operator->()->get();}
  operator short int(){return *(short int*) dynamic_cast<C*>(this)->operator->()->get();}
  operator int(){return *(int*) dynamic_cast<C*>(this)->operator->()->get();}
  operator long int(){return *(long int*) dynamic_cast<C*>(this)->operator->()->get();}
  operator long long int(){return *(long long int*) dynamic_cast<C*>(this)->operator->()->get();}
  operator unsigned char(){return *(unsigned char*) dynamic_cast<C*>(this)->operator->()->get();}
  operator unsigned short int(){return *(unsigned short int*) dynamic_cast<C*>(this)->operator->()->get();}
  operator unsigned int(){return *(unsigned int*) dynamic_cast<C*>(this)->operator->()->get();}
  operator unsigned long int(){return *(unsigned long int*) dynamic_cast<C*>(this)->operator->()->get();}
  operator unsigned long long int(){return *(unsigned long long int*) dynamic_cast<C*>(this)->operator->()->get();}
  operator float(){return *(float*) dynamic_cast<C*>(this)->operator->()->get();}
  operator double(){return *(double*) dynamic_cast<C*>(this)->operator->()->get();}
  operator long double(){return *(long double*) dynamic_cast<C*>(this)->operator->()->get();}
  operator void*(){return *(void**) dynamic_cast<C*>(this)->operator->()->get();}
  operator wchar_t(){return *(wchar_t*) dynamic_cast<C*>(this)->operator->()->get();}
  operator char*(){return (char*) dynamic_cast<C*>(this)->operator->()->get();}
  operator wchar_t*(){return (wchar_t*) dynamic_cast<C*>(this)->operator->()->get();}
  
  operator bool() const {return *(bool*) dynamic_cast<const C*>(this)->operator->()->get();}
  operator char() const {return *(char*) dynamic_cast<const C*>(this)->operator->()->get();}
  operator short int() const {return *(short int*) dynamic_cast<const C*>(this)->operator->()->get();}
  operator int() const {return *(int*) dynamic_cast<const C*>(this)->operator->()->get();}
  operator long int() const {return *(long int*) dynamic_cast<const C*>(this)->operator->()->get();}
  operator long long int() const {return *(long long int*) dynamic_cast<const C*>(this)->operator->()->get();}
  operator unsigned char() const {return *(unsigned char*) dynamic_cast<const C*>(this)->operator->()->get();}
  operator unsigned short int() const {return *(unsigned short int*) dynamic_cast<const C*>(this)->operator->()->get();}
  operator unsigned int() const {return *(unsigned int*) dynamic_cast<const C*>(this)->operator->()->get();}
  operator unsigned long int() const {return *(unsigned long int*) dynamic_cast<const C*>(this)->operator->()->get();}
  operator unsigned long long int() const {return *(unsigned long long int*) dynamic_cast<const C*>(this)->operator->()->get();}
  operator float() const {return *(float*) dynamic_cast<const C*>(this)->operator->()->get();}
  operator double() const {return *(double*) dynamic_cast<const C*>(this)->operator->()->get();}
  operator long double() const {return *(long double*) dynamic_cast<const C*>(this)->operator->()->get();}
  operator void*() const {return *(void**) dynamic_cast<const C*>(this)->operator->()->get();}
  operator wchar_t() const {return *(wchar_t*) dynamic_cast<const C*>(this)->operator->()->get();}
  operator char*() const {return (char*) dynamic_cast<const C*>(this)->operator->()->get();}
  operator wchar_t*() const {return (wchar_t*) dynamic_cast<const C*>(this)->operator->()->get();}

  CastableBasicDataTypes& operator=(bool e){t = BasicDataTypes::type_bool; dynamic_cast<C*>(this)->operator->()->set(&e, sizeof(bool)); return *this;}
  CastableBasicDataTypes& operator=(char e){t = BasicDataTypes::type_char; dynamic_cast<C*>(this)->operator->()->set(&e, sizeof(char)); return *this;}
  CastableBasicDataTypes& operator=(short int e){t = BasicDataTypes::type_short_int; dynamic_cast<C*>(this)->operator->()->set(&e, sizeof(short int)); return *this;}
  CastableBasicDataTypes& operator=(int e){t = BasicDataTypes::type_int; dynamic_cast<C*>(this)->operator->()->set(&e, sizeof(int)); return *this;}
  CastableBasicDataTypes& operator=(long int e){t = BasicDataTypes::type_long_int; dynamic_cast<C*>(this)->operator->()->set(&e, sizeof(long int)); return *this;}
  CastableBasicDataTypes& operator=(long long int e){t = BasicDataTypes::type_long_long_int; dynamic_cast<C*>(this)->operator->()->set(&e, sizeof(long long int)); return *this;}
  CastableBasicDataTypes& operator=(unsigned char e){t = BasicDataTypes::type_unsigned_char; dynamic_cast<C*>(this)->operator->()->set(&e, sizeof(unsigned char)); return *this;}
  CastableBasicDataTypes& operator=(unsigned short int e){t = BasicDataTypes::type_unsigned_short_int; dynamic_cast<C*>(this)->operator->()->set(&e, sizeof(unsigned short int)); return *this;}
  CastableBasicDataTypes& operator=(unsigned int e){t = BasicDataTypes::type_unsigned_int; dynamic_cast<C*>(this)->operator->()->set(&e, sizeof(unsigned int)); return *this;}
  CastableBasicDataTypes& operator=(unsigned long int e){t = BasicDataTypes::type_unsigned_long_int; dynamic_cast<C*>(this)->operator->()->set(&e, sizeof(unsigned long int)); return *this;}
  CastableBasicDataTypes& operator=(unsigned long long int e){t = BasicDataTypes::type_unsigned_long_long_int; dynamic_cast<C*>(this)->operator->()->set(&e, sizeof(unsigned long long int)); return *this;}
  CastableBasicDataTypes& operator=(float e){t = BasicDataTypes::type_float; dynamic_cast<C*>(this)->operator->()->set(&e, sizeof(float)); return *this;}
  CastableBasicDataTypes& operator=(double e){t = BasicDataTypes::type_double; dynamic_cast<C*>(this)->operator->()->set(&e, sizeof(double)); return *this;}
  CastableBasicDataTypes& operator=(long double e){t = BasicDataTypes::type_long_double; dynamic_cast<C*>(this)->operator->()->set(&e, sizeof(long double)); return *this;}
  CastableBasicDataTypes& operator=(void* e){t = BasicDataTypes::type_void_pointer; dynamic_cast<C*>(this)->operator->()->set(&e, sizeof(void*)); return *this;}
  CastableBasicDataTypes& operator=(wchar_t e){t = BasicDataTypes::type_wchar_t; dynamic_cast<C*>(this)->operator->()->set(&e, sizeof(wchar_t)); return *this;}
  
  CastableBasicDataTypes& operator=(char* e){t = BasicDataTypes::type_char_pointer; dynamic_cast<C*>(this)->operator->()->set(e, strlen(e)); return *this;}
  CastableBasicDataTypes& operator=(wchar_t* e){t = BasicDataTypes::type_wchar_t_pointer; dynamic_cast<C*>(this)->operator->()->set(e, wcslen(e) * sizeof(wchar_t)); return *this;}

  CastableBasicDataTypes& operator=(const char* e){t = BasicDataTypes::type_char_pointer; dynamic_cast<C*>(this)->operator->()->set(e, strlen(e)); return *this;}
  CastableBasicDataTypes& operator=(const wchar_t* e){t = BasicDataTypes::type_wchar_t_pointer; dynamic_cast<C*>(this)->operator->()->set(e, wcslen(e) * sizeof(wchar_t)); return *this;}
  
  BasicDataTypes type() const {return t;}
  void type_set(BasicDataTypes type){t = type;}
};

/*// CONTAINER: provides advanced features for a basic container C.
// I must provide + - == != < > <= >=
// C must have the following interface:
//   void resize(const I& size);
//   I size() const;
//   T& operator[](const I& index) const;
//   or T& operator[](const I& index);
template <typename T, typename I, typename C>
class Container: virtual public C
{
public:
  using C::C;
  using C::operator=;
  using C::operator[];
  using C::size;
//  using C::resize;
  
//  Container(){}
  virtual ~Container(){}

  Container& resize(const I& size){C::resize(size); return *this;}
//  I size() const {return C::size();}
//  T& get(const I& index) const {return ((T*) C::get())[index];}
//  T& operator[](const I& index) const {return (T&) C::operator[](index);}
//  T& operator[](const I& index){return (T&) C::operator[](index);}
//  template <typename I2> T& operator[](const I2& index) const {return (T&) C::operator[](index);}
  
  bool index_is_valid(const I& index)
  {
    if(index < 0 || size() <= index) return false;
    else return true;
  }
  
  void index_check(const I& index)
  {
    if(index_is_valid(index)) throw "index out of range";
  }
  
  T& index_validate(const I& index)
  {
    index_check(index);
    return *this;
  }
  
  T& get(const I& index)
  {
    return operator[](index);
  }
  
  T& del(const I& index)
  {
    index_check(index);
    // todo: destroy object at index
    for(I i = index + 1; i < size(); i++) get(i - 1) = get(i);
    return *this;
  }
  
  Container& ins(const T& elem, const I& index)
  {
    debug_line
    try
    {
      index_check(index);
    }
    catch(...)
    {
      index_check(index - 1);
    }
    debug_line
    resize(size() + 1);
    debug_line
    for(I i = index + 1; i < size(); i++) get(i) = get(i - 1);
    debug_line
    get(index) = elem;
    debug_line
    return *this;
  }
  
  Container& operator<<(const T& elem)
  {
    debug_line
    return ins(elem, size());
  }
  
  Container& operator<<(const Container& c)
  {
    debug_line
    for(I i = 0; i < c.size(); i++)
    {
      ins(c[i], size());
    }
    return *this;
  }
};*/

#endif	/* CONTAINER_H */
