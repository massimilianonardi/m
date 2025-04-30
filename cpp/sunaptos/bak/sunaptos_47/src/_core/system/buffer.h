#ifndef _BUFFER_H
#define	_BUFFER_H

class Buffer
{
protected:
  long sz;
  void* pb;

public:
  Buffer();
  Buffer(long size);
  Buffer(const void* pbuf, long size);
  Buffer(const Buffer& b);
  Buffer& operator=(const Buffer& b);
  virtual ~Buffer();

  long size() const;
  void resize(long size);
  const void* get() const;
  void set(const void* pbuf, long size);

  bool operator==(const Buffer& b) const;
//  bool operator< (const Buffer& b) const;
  inline bool operator!=(const Buffer& b) const {return !operator==(b);}
//  inline bool operator> (const Buffer& b) const {return b.operator<(*this);}
//  inline bool operator>=(const Buffer& b) const {return !operator<(b);}
//  inline bool operator<=(const Buffer& b) const {return !operator>(b);}
};

#endif	// _BUFFER_H
