#ifndef CONTAINER_H
#define	CONTAINER_H

#include <memory>
#include <utility>
//#include <type_traits>

template <typename T, typename I, typename C>
class Container
{
protected:
  std::shared_ptr<C> c;

public:
  Container(): c(std::shared_ptr<C>(new C())) {}
  virtual ~Container(){}
  
  virtual C& operator*(){return c.operator*();}
  virtual C* operator->(){return c.operator->();}
  virtual const C& operator*() const {return c.operator*();}
  virtual const C* operator->() const {return c.operator->();}

  bool operator==(const Container& b) const {return *c == *(b.c);}
  bool operator!=(const Container& b) const {return !operator==(b);}

  Container(const Container& b): Container() {*this = b;}
  Container(Container&& b): Container() {*this = b;}
  Container(Container* b): Container() {*this = b;}
  Container& operator=(const Container& b){return copy(b);}
  Container& operator=(Container&& b){return move(b);}
  Container& operator=(const Container* b){return link(b);}
  Container& operator^(const Container& b){return link(b);}
  Container& operator|(const Container& b){return link(b);}
  Container& operator&(const Container& b){return link(b);}

  Container& copy(const Container& b){if(&b != this){*c = *b.c;}; return *this;}
  Container& move(Container& b){if(&b != this){c = std::move(b.c);}; return *this;}
  Container& link(const Container& b){if(&b != this){c = b.c;}; return *this;}

//------------------------------------------------------------------------------

protected:
  void link_element(T& source, T& destination){static_assert(std::is_member_function_pointer<decltype(&T::link)>::value, "class is not capable of copy/move/link!"); destination.link(source);}
  void destroy_element(T& e){}

public:
  Container& operator<<(T& b){resize(size() + 1); link_element(b, operator[](size() - 1)); return *this;}
  Container& operator<<(T&& b){resize(size() + 1); operator[](size() - 1) = std::move(b); return *this;}
  Container& operator>>(T& b){b = std::move(operator[](0)); del(0); return *this;}
  Container& operator<<=(const T& b){resize(size() + 1); operator[](size() - 1) = b; return *this;}
  Container& operator>>=(T& b){return operator>>(b);}
  
  Container& operator<<(Container& b){for(I i = 0; i < b.size(); i++) (*this) << b[i]; return *this;}
  Container& operator>>(Container& b){for(I i = 0; i < b.size(); i++) (*this) >> b[i]; return *this;}
  Container& operator<<=(const Container& b){for(I i = 0; i < b.size(); i++) (*this) <<= b[i]; return *this;}
  Container& operator>>=(Container& b){for(I i = 0; i < b.size(); i++) (*this) >>= b[i]; return *this;}

//------------------------------------------------------------------------------

  Container& resize(const I& size){c->resize(size); return *this;}
  I size() const {return c->size();}
  const T& operator[](const I& index) const {return c->operator[](index);}
  T& operator[](const I& index){return c->operator[](index);}

//------------------------------------------------------------------------------

  Container& del(const I& index){destroy_element(operator[](index)); for(I i = index + 1; i < size(); i++) operator[](i - 1) = std::move(operator[](i)); resize(size() - 1); return *this;}
  Container& del(const I& index, const I& size){for(I i = 0; i < size; i++) del(index); return *this;}
  
  Container& ins(const I& index){resize(size() + 1);for(I i = size() - 1; index < i; i--) operator[](i) = std::move(operator[](i - 1)); operator[](index) = std::move(T()); return *this;}
  Container& ins(const I& index, const I& size){for(I i = 0; i < size; i++) ins(index); return *this;}
  
  Container& ins(const Container& b, const I& index){for(I i = 0; i < size; i++) ins(index + i)[index + i] = b[i]; return *this;}
  Container& ins(Container&& b, const I& index){for(I i = 0; i < size; i++) ins(index + i)[index + i] = std::move(b[i]); return *this;}
  Container& ins(Container* b, const I& index){for(I i = 0; i < size; i++) link_element(b[i], ins(index + i)[index + i]); return *this;}
  
//  Container& move(const I& index, const I& new_index){T b = std::move(get(index)); get(index) = std::move(get(new_index)); get(new_index) = std::move(b); return *this;}
//  Container& move(const I& index, const I& size, const I& new_index){for(I i = 0; i < size; i++) move(index + i, new_index + 1); return *this;}
//  T extract(const I& index) const {T b = std::move(get(index)); del(index); return b;}
//  Container extract(const I& index, const I& size){Container r; for(I i = 0; i < size; i++) r.get(i) = extract(index + i); return r;}
  Container sub(const I& index, const I& size){Container r; for(I i = 0; i < size; i++) r[i] = operator[](index + i); return r;}
  
};

#endif	/* CONTAINER_H */
