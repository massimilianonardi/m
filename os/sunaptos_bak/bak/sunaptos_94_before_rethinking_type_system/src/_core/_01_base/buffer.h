#ifndef _BUFFER_H
#define	_BUFFER_H

#include "exception.h"

#include <utility>

typedef int buffer_index;

class buffer
{
protected:
  buffer_index sz;
  void* pb;
  
public:
  // generic constructors and destructor
  buffer(): pb(0), sz(0) {resize(0);}
  virtual ~buffer(){free(pb); pb = 0;}
  
  // copy, move
  buffer(const buffer& b): buffer() {*this = b;}
  buffer(buffer&& b): buffer() {*this = std::move(b);}
  buffer& operator=(const buffer& b);
  buffer& operator=(buffer&& b);
  
  // equality
  bool operator==(const buffer& b) const;
  bool operator!=(const buffer& b) const {return !operator==(b);}
  
  // standard container
  buffer& resize(const buffer_index& size);
  buffer_index size() const {return sz;}
  char& operator[](const buffer_index& index){if(sz < index) exception_throw_type(exception_type::index_out_of_boundaries); return ((char*) get())[index];}
  const char& operator[](const buffer_index& index) const {if(sz < index) exception_throw_type(exception_type::index_out_of_boundaries); return ((char*) get())[index];}
  
  // custom optimized container methods
  const void* get() const {return (const void*) pb;}
  buffer& set(const void* pbuf, const buffer_index& size);
  
  buffer& ins(const char& e, const buffer_index& index);
  buffer& ins(const buffer& b, const buffer_index& index);
  buffer& ins(const char& e){return ins(e, sz - 1);}
  buffer& ins(const buffer& b){return ins(b, sz - 1);}
  buffer& del(const buffer_index& index, const buffer_index& size);
  buffer& del(const buffer_index& index){return del(index, 1);}
  buffer& del(){return del(sz - 1, 1);}
  buffer& move(const buffer_index& index, const buffer_index& size, const buffer_index& new_index);
};

#endif	// _BUFFER_H
