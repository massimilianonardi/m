#ifndef CONTAINER_H
#define	CONTAINER_H

#include <memory>
#include <utility>

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
class Container
{
protected:
  std::shared_ptr<C> c;
  
public:
  
  Container(): c(std::shared_ptr<C>(new C())) {}
  virtual ~Container(){}
  
  Container(const Container& b): Container() {*this = b;}
  Container(Container&& b): Container() {*this = b;}
//  Container(Container* b): Container() {*this = b;}
  Container& operator=(const Container& b){return copy(b);}
  Container& operator=(Container&& b){return move(b);}
//  Container& operator=(const Container* b){return link(b);}
//  Container& operator^(const Container& b){return link(b);}
//  Container& operator|(const Container& b){return link(b);}
//  Container& operator&(const Container& b){return link(b);}
  Container& copy(const Container& b){if(&b != this){*c = *b.c;}; return *this;}
  Container& move(Container&& b){if(&b != this){c = std::move(b.c);}; return *this;}
  Container& link(const Container& b){if(&b != this){c = b.c;}; return *this;}


  Container& resize(const I& size){(*c).resize(size); return *this;}
  I size() const {return (*c).size();}
  T& get(const I& index) const {return (*c)[index];}
  
  Container& del(const I& index){for(I i = index + 1; i < size(); i++) get(i - 1) = get(i); resize(size() - 1); return *this;}
  Container& ins(const T& e, const I& index){resize(size() + 1);for(I i = size() - 1; index < i; i--) get(i) = get(i - 1); get(index) = e; return *this;}
  Container& ins(T&& e, const I& index){resize(size() + 1);for(I i = size() - 1; index < i; i--) get(i) = get(i - 1); get(index) = std::move(e); return *this;}
  Container& ins(const T* e, const I& index){resize(size() + 1);for(I i = size() - 1; index < i; i--) get(i) = get(i - 1); get(index) = e; return *this;}
  Container& move(const I& index, const I& new_index){T b = std::move(get(index)); get(index) = std::move(get(new_index)); get(new_index) = std::move(b); return *this;}
  
  Container& del(const I& index, const I& size){for(I i = 0; i < size; i++) del(index); return *this;}
  Container& ins(const Container& b, const I& index){for(I i = 0; i < size; i++) ins(b.get(index + i)); return *this;}
  Container& ins(Container&& b, const I& index){for(I i = 0; i < size; i++) ins(b.get(index + i)); return *this;}
  Container& ins(const Container* b, const I& index){for(I i = 0; i < size; i++) ins(b.get(index + i)); return *this;}
  Container& move(const I& index, const I& size, const I& new_index){for(I i = 0; i < size; i++) move(index + i, new_index + 1); return *this;}
  T extract(const I& index) const {T b = std::move(get(index)); del(index); return b;}
  Container extract(const I& index, const I& size){Container r; for(I i = 0; i < size; i++) r.get(i) = extract(index + i); return r;}
  Container sub(const I& index, const I& size){Container r; for(I i = 0; i < size; i++) r.get(i) = get(index + i); return r;}
  
  const T& operator[](const I& index) const {return get(index);}
  T& operator[](const I& index){return get(index);}
  Container& operator<<(const T& b){resize(size()+1); get(size()-1).link(b); return *this;}
  Container& operator<<(T&& b){resize(size()+1); get(size()-1) = std::move(b); return *this;}
  Container& operator>>(T& b){b = std::move(get(0)); del(0, 1); return *this;}
  Container& operator<<=(const T& b){resize(size()+1); get(size()-1) = b; return *this;}
//  Container& operator>>=(T& b){b = std::move(get(0)); del(0, 1); return *this;}
  Container& operator<<(const Container& b){for(I i = 0; i < b.size(); i++) (*this) << b[i]; return *this;}
  Container& operator>>(Container& b){for(I i = 0; i < b.size(); i++) (*this) >> b[i]; return *this;}
  Container& operator<<=(const Container& b){for(I i = 0; i < b.size(); i++) (*this) <<= b[i]; return *this;}
//  Container& operator>>=(Container& b){for(I i = 0; i < b.size(); i++) (*this) >>= b[i]; return *this;}
  bool operator==(const Container& b) const {return *c == *(b.c);}
  bool operator!=(const Container& b) const {return !operator==(b);}
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
