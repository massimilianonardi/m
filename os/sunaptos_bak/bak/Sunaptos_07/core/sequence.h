#ifndef _SEQUENCE_H
#define	_SEQUENCE_H

#include "streamable.h"
#include "number.h"
#include <iostream>

class Sequence: virtual public Streamable
{
  protected:
    void* pb;
//    char* pb;
    number sz;
    number wd;

  public:
    Sequence();
    Sequence(const Sequence& seq);
    Sequence(number width);
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
//      if(sizeof(T) != wd)
//      {
//        throw 0;
//      }
//      if(i < 0 || sz <= i)
//      {
//        throw 0;
//      }
      return reinterpret_cast<T*>(pb)[(long) i];
    }

    template <typename T>
    void put(T& e, number i)
    {
      if(sizeof(T) > wd)
      {
        throw 0;
      }
      if(i < 0 || sz <= i)
      {
        throw 0;
      }
      reinterpret_cast<T*>(pb)[(long) i] = e;
    }

    template <typename T>
    Sequence& copy(T* e, number size)
    {
      wd = sizeof(T);
      resize(size);
      memcpy(pb, e, size * wd);
      return *this;
    }

    Sequence& operator=(const Sequence& seq);

    template <typename T>
    operator T*()
    {
//      return get<T>();
      return reinterpret_cast<T*>(pb);
    }

    template <typename T>
    operator T()
    {
      return *reinterpret_cast<T*>(pb);
    }

    Sequence& operator|(number i)
    {
//      return *get<Sequence*>(i);
      return *reinterpret_cast<Sequence*>(reinterpret_cast<number*>(pb) + (long) i);
    }

    Sequence& operator()(number i)
    {
//      return *get<Sequence*>(i);
      return *(reinterpret_cast<Sequence*>(pb) + (long) i);
    }

    number operator^(number i)
    {
      return *(reinterpret_cast<number*>(pb) + (long) i);
    }

    number operator[](number i)
    {
      return *(reinterpret_cast<number*>(pb) + (long) i);
    }

    Sequence& operator<<(number e)
    {
      resize(size() + 1);
      reinterpret_cast<number*>(pb)[(long) size() - 1] = e;
      return *this;
    }

//    template <typename T>
//    Sequence& operator<<(T& e)
//    {
//      resize(size() + 1);
//      put(e, size() - 1);
//      return *this;
//    }

    template <typename T>
    Sequence& operator<<(T* e)
    {
      resize(size() + 1);
      Sequence* seq = new Sequence(4);
      (*seq) << 15;
      long n = (*seq)^0;
      std::cout << "\n seq = " << n;
      std::cout << "\n seq = " << (long) size();
//      seq->resize(1);
//      seq->put<number>((number) 14, (number) 0);
//      put(seq, size());
      reinterpret_cast<number*>(pb)[(long) size() - 1] = (long) seq;
      return *this;
    }
};

//template <typename T>
//T*& operator<<=(T*& e, Sequence& seq)
//{
//  return e = seq.get<T>();
//}

//inline
//Sequence& operator|(Sequence& seq, int i)
//{
//  return *seq.get<Sequence*>(i);
//}

#endif	// _SEQUENCE_H
