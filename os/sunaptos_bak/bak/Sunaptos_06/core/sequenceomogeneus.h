#ifndef _SEQUENCEOMOGENEUS_H
#define	_SEQUENCEOMOGENEUS_H

#include "number.h"
#include "sequence.h"

template <class T>
class SequenceOmogeneus: virtual public Sequence
{
  protected:
    number sz;
    number wd;

  public:
    SequenceOmogeneus()
    {
      wd = sizeof(T);
    }

    virtual ~SequenceOmogeneus()
    {
    }

    number size()
    {
      return sz;
    }
    
    void resize(number size)
    {
      // todo: guarrantee integer result because double operations are approximative!!!
      Sequence::resize(size * wd);
      sz = size;
    }

    T* get()
    {
      return pb;
    }

    T& operator()(number i)
    {
      if(i < 0 || sz <= i)
      {
        throw 0;
      }
      
      number a = i*wd;
      char* p = (char*) pb;
      p += (long) a;
      return *reinterpret_cast<T*>(p);
//      return dynamic_cast<T>(*((char*) pb + i*wd));
//      return *((T*) pb + i);
    }

    SequenceOmogeneus<T>& operator=(const Sequence& seq)
    {
      *this = *dynamic_cast<SequenceOmogeneus<T>*>(const_cast<Sequence*>(&seq));
      return *this;
    }

    SequenceOmogeneus<T>& operator=(const Sequence* seq)
    {
      *this = *dynamic_cast<SequenceOmogeneus<T>*>(const_cast<Sequence*>(seq));
      return *this;
    }

    SequenceOmogeneus<T>& operator<<(const Sequence& seq)
    {
      *this = *dynamic_cast<SequenceOmogeneus<T>*>(const_cast<Sequence*>(&seq));
      return *this;
    }

    SequenceOmogeneus<T>& operator<<(const Sequence* seq)
    {
      *this = *dynamic_cast<SequenceOmogeneus<T>*>(const_cast<Sequence*>(seq));
      return *this;
    }

//    void put(T& o)
//    {
//      // todo: implement
//    }
//
//    void put(T& o, number i)
//    {
//      // todo: implement
//    }
//    rem
//    del
//    raw
//    operator[]
};

typedef SequenceOmogeneus<Sequence*> seqseq;
typedef SequenceOmogeneus<number> numseq;
typedef SequenceOmogeneus<num8> num8seq;
typedef SequenceOmogeneus<num16> num16seq;
typedef SequenceOmogeneus<num32> num32seq;

//numseq& operator<<(numseq& seqomo, const Sequence* seq)
//{
//  seqomo = *dynamic_cast<numseq*>(const_cast<Sequence*>(seq));
//  return seqomo;
//}

#endif	// _SEQUENCEOMOGENEUS_H
