#ifndef _SEQUENCE_H
#define	_SEQUENCE_H

#include "streamable.h"
#include "number.h"
#include <iostream>

class Sequence: virtual public Streamable
{
  protected:
    char* pb;
    number sz;
    number wd;

  public:
    Sequence();
    Sequence(const Sequence& seq);
    Sequence(number width);
    Sequence(const char* e);
    Sequence(const wchar_t* e);
    virtual ~Sequence();

    void read(StreamInput* si);
    void write(StreamOutput* so);

    number width();
    number size();
    void resize(number size);
//    void reserve(number size);

    template <typename T>
    T* get()
    {
      if(sizeof(T) != wd)
      {
        throw 0;
      }
      return reinterpret_cast<T*>(pb);
    }

    template <typename T>
    T get(number i)
    {
//      if(sizeof(T) > wd)
//      {
//        throw 0;
//      }
      if(i < 0 || sz <= i)
      {
        throw 0;
      }
      // this means that put and get must be performed with same type because of alignement implied by
      // the following and put is different from that used by c-style casts.
      // the proper way should be a typedef char seqtype[wd] and cast to this type instead of T and then use
      // c-style casts...btw the current method is more general...think about!!!
      return *reinterpret_cast<T*>(pb + ((long long) wd * (long long) i));
    }

    template <typename T>
    Sequence& set(T e, number i)
    {
      if(sizeof(T) > wd)
      {
        throw 0;
      }
      if(i < 0 || sz <= i)
      {
        throw 0;
      }
      *reinterpret_cast<T*>(pb + ((long long) wd * (long long) i)) = e;
      return *this;
    }

    template <typename T>
    Sequence& ins(T e)
    {
      resize(sz + 1);
      set<T>(e, sz - 1);
      return *this;
    }

    template <typename T>
    Sequence& ins(T e, number i)
    {
      if(i < 0 || sz < i)
      {
        throw 0;
      }
      resize(sz + 1);
      for(number ind = sz - 1; i < ind && ind < sz; ind--)
      {
        set<T>(get<T>(ind - 1), ind);
      }
      set<T>(e, i);
      return *this;
    }

    template <typename T>
    Sequence& del(number i)
    {
      if(i < 0 || sz <= i)
      {
        throw 0;
      }
      for(number ind = i + 1; i < ind < sz; ind++)
      {
        set<T>(get<T>(ind), ind - 1);
      }
      resize(sz - 1);
      return *this;
    }

    template <typename T>
    Sequence& del(number i, number j)
    {
      // todo: implement
      if(i < 0 || sz <= i || j < 0 || sz <= j || i > j)
      {
        throw 0;
      }
      return *this;
    }

    template <typename T>
    Sequence& add(T e)
    {
      resize(sz + 1);
      set<T>(e, sz - 1);
      return *this;
    }

    template <typename T>
    Sequence& copy(T* pe, number size)
    {
      wd = sizeof(T);
      resize(size);
      memcpy(pb, pe, size * wd);
      return *this;
    }

    Sequence& operator=(const Sequence& seq);
    Sequence& operator=(const char* e);
    Sequence& operator=(const wchar_t* e);

//    template <typename T>
//    operator T*()
//    {
//      return get<T>();
//    }

    template <typename T>
    operator T()
    {
      return reinterpret_cast<T>(pb);
    }

//    Sequence& operator|(number i)
//    {
//      return *get<Sequence*>(i);
//    }

    template <typename T>
    Sequence& operator()(T e, number i)
    {
      return set<T>(e, i);
    }

    Sequence& operator()(number i)
    {
      return *get<Sequence*>(i);
    }

//    number operator^(number i)
//    {
//      return get<number>(i);
//    }

    number operator[](number i)
    {
      return get<number>(i);
    }

    Sequence& operator<<(number e)
    {
      return add<number>(e);
    }

    Sequence& operator<<(Sequence* e)
    {
      return add<Sequence*>(e);
    }

    Sequence& operator<<(const char* e);
    Sequence& operator<<(const wchar_t* e);

//    template <typename T>
//    Sequence& operator<<(T e)
//    {
//      return add<T>(e);
//    }
};

#endif	// _SEQUENCE_H
