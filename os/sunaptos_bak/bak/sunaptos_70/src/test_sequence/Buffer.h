#ifndef _BUFFER_H
#define	_BUFFER_H

#include <cstdlib>
#include <cstring>
#include <cwchar>
#include <utility>

typedef int buffer_index;

class Buffer
{
protected:
  buffer_index sz;
  void* pb;

public:
  Buffer(): pb(0), sz(0) {}
  Buffer(const buffer_index& size): Buffer() {resize(size);}
  Buffer(const void* pbuf, const buffer_index& size): Buffer() {set(pbuf, size);}
  virtual ~Buffer(){free(pb); pb = 0;}
  
  Buffer(const Buffer& b): Buffer() {*this = b;}
  Buffer(Buffer&& b): Buffer() {*this = std::move(b);}
  Buffer& operator=(const Buffer& b){if(&b != this){set(b.pb, b.sz);}; return *this;}
  Buffer& operator=(Buffer&& b){if(&b != this){pb = b.pb; sz = b.sz; b.pb = 0; b.sz = 0;}; return *this;}
  
  bool operator==(const Buffer& b) const;
  bool operator!=(const Buffer& b) const {return !operator==(b);}

  const void* get() const {return (const void*) pb;}
  Buffer& set(const void* pbuf, const buffer_index& size);

  Buffer& resize(const buffer_index& size);
  const buffer_index size() const {return sz;}
  char& get(const buffer_index& index){return ((char*) get())[index];}
  const char& get(const buffer_index& index) const {return ((char*) get())[index];}
  char& operator[](const buffer_index& index){return ((char*) get())[index];}
  const char& operator[](const buffer_index& index) const {return ((char*) get())[index];}
  
  Buffer& ins(const char& e, const buffer_index& index);
  Buffer& ins(const Buffer& b, const buffer_index& index);
  Buffer& del(const buffer_index& index, const buffer_index& size);
  Buffer& del(const buffer_index& index){return del(index, 1);}
  Buffer& move(const buffer_index& index, const buffer_index& size, const buffer_index& new_index);
};

#endif	// _BUFFER_H
