#ifndef CONTAINER_H
#define	CONTAINER_H

// CONTAINER: provides advanced features for a basic container C.
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
//  using C::C;
//  using C::operator=;
  
//  Container(){}
  virtual ~Container(){}

  Container& resize(const I& size){C::resize(size); return *this;}
  I size() const {return C::size();}
//  T& get(const I& index) const {return ((T*) C::get())[index];}
  T& operator[](const I& index) const {return (T&) C::operator[](index);}
  
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
    try
    {
      index_check(index);
    }
    catch(...)
    {
      index_check(index - 1);
    }
    resize(size() + 1);
    for(I i = index + 1; i < size(); i++) get(i) = get(i - 1);
    get(index) = elem;
    return *this;
  }
  
  Container& operator<<(const T& elem)
  {
    return ins(elem, size());
  }
};

#endif	/* CONTAINER_H */
