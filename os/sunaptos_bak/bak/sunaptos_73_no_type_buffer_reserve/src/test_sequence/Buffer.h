#ifndef _BUFFER_H
#define	_BUFFER_H

#include <cstdlib>
#include <cstring>
#include <utility>

typedef int buffer_index;
//typedef double buffer_index;

//class Buffer;
//typedef Buffer buffer_index;

class Buffer
{
protected:
  buffer_index rsz;
  buffer_index sz;
  void* pb;
  
public:
  // generic constructors and destructor
  Buffer(): pb(0), sz(0), rsz(0) {}
  virtual ~Buffer(){free(pb); pb = 0;}
  
  // copy, move
  Buffer(const Buffer& b): Buffer() {*this = b;}
  Buffer(Buffer&& b): Buffer() {*this = std::move(b);}
  Buffer& operator=(const Buffer& b){if(&b != this){sz = b.sz; reserve(b.rsz); memcpy(pb, b.pb, b.rsz);}; return *this;}
  Buffer& operator=(Buffer&& b){if(&b != this){pb = b.pb; sz = b.sz; rsz = b.rsz; b.pb = 0; b.sz = 0; b.rsz = 0;}; return *this;}
  
  // equality
  bool operator==(const Buffer& b) const;
  bool operator!=(const Buffer& b) const {return !operator==(b);}
  
  // standard container
  Buffer& reserve(const buffer_index& size);
  Buffer& resize(const buffer_index& size);
  buffer_index reserved() const {return rsz;}
  buffer_index size() const {return sz;}
  char& operator[](const buffer_index& index){return ((char*) get())[index];}
  const char& operator[](const buffer_index& index) const {return ((char*) get())[index];}
  
  // custom optimized container methods
  const void* get() const {return (const void*) pb;}
  Buffer& set(const void* pbuf, const buffer_index& size);
  
  Buffer& ins(const char& e, const buffer_index& index);
  Buffer& ins(const Buffer& b, const buffer_index& index);
  Buffer& del(const buffer_index& index, const buffer_index& size);
  Buffer& del(const buffer_index& index){return del(index, 1);}
  Buffer& move(const buffer_index& index, const buffer_index& size, const buffer_index& new_index);
};

#endif	// _BUFFER_H
