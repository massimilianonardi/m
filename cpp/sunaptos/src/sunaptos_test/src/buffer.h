#ifndef _BUFFER_H
#define	_BUFFER_H

typedef int buffer_index;

class buffer
{
protected:
  buffer_index sz;
  void* pb;
  
public:
  buffer();
  virtual ~buffer();
  
  buffer(const buffer& b);
  buffer(buffer&& b);
  buffer& operator=(const buffer& b);
  buffer& operator=(buffer&& b);
  
  bool operator==(const buffer& b) const;
  bool operator!=(const buffer& b) const;
  
  buffer& resize(const buffer_index& size);
  buffer_index size() const;
  char& operator[](const buffer_index& index);
  const char& operator[](const buffer_index& index) const;
  
  const void* get() const;
  const void* get(const buffer_index& index) const;
  buffer& set(const void* pbuf, const buffer_index& size);
  buffer& set(const void* pbuf, const buffer_index& size, const buffer_index& offset);
  
  buffer& ins(const char& e, const buffer_index& index);
  buffer& ins(const buffer& b, const buffer_index& index);
  buffer& ins(const char& e);
  buffer& ins(const buffer& b);
  buffer& del(const buffer_index& index, const buffer_index& size);
  buffer& del(const buffer_index& index);
  buffer& del();
  buffer& move(const buffer_index& index, const buffer_index& size, const buffer_index& new_index);
};

#endif	// _BUFFER_H
