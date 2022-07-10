#ifndef _SEQUENCEOMOGENEUS_H
#define	_SEQUENCEOMOGENEUS_H

//#include "number.h"
#include "sequence.h"

template <typename T>
class SequenceOmogeneus: virtual public Sequence
{
  public:
    SequenceOmogeneus()
    {
//      wd = sizeof(T);
      Sequence::Sequence(sizeof(T));
    }

    virtual ~SequenceOmogeneus()
    {
    }

    T* get()
    {
      return pb;
    }

    T& operator()(number i)
    {
//      Sequence::operator()(i);
      return *reinterpret_cast<T*>(Sequence::operator()(i));
    }

    SequenceOmogeneus<T>& operator=(const Sequence& seq)
    {
      *this = *dynamic_cast<SequenceOmogeneus<T>*>(const_cast<Sequence*>(&seq));
      return *this;
    }

//    SequenceOmogeneus<T>& operator=(const Sequence* seq)
//    {
//      *this = *dynamic_cast<SequenceOmogeneus<T>*>(const_cast<Sequence*>(seq));
//      return *this;
//    }

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

    SequenceOmogeneus<T>& operator<<(const T& e)
    {
      resize(size() + 1);
      // todo: implement
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

//class SeqOmo: virtual public Sequence
//{
//  public:
//    template <typename T>
//    T gse(number i)
//    {
//      return *dynamic_cast<T*>(const_cast<Sequence>(seq)(i));
//    }
//};

typedef SequenceOmogeneus<Sequence*> seqseq;
typedef SequenceOmogeneus<number> numseq;
typedef SequenceOmogeneus<num8> num8seq;
typedef SequenceOmogeneus<num16> num16seq;
typedef SequenceOmogeneus<num32> num32seq;

//template <typename T>
//T operator()(Sequence& seq, number i)
//T gse(Sequence& seq, number i)
//{
//  if(seq.width() != sizeof(T))
//  {
//    throw 0;
//  }
//  return *dynamic_cast<T*>(const_cast<Sequence>(seq)(i));
//}

//template <typename T>
//T gse(Sequence& seq, number i, T& e)
//{
//  return e = *dynamic_cast<T*>(const_cast<Sequence>(seq)(i));
//}

//template <typename T>
//T operator|(Sequence& seq, number i)
//{
//  if(seq.width() != sizeof(T))
//  {
//    throw 0;
//  }
//  return *dynamic_cast<T*>(const_cast<Sequence>(seq)(i));
//}

//template <typename T>
//T* operator|(Sequence& seq, number i)
//{
//  if(seq.width() != sizeof(T))
//  {
//    throw 0;
//  }
//  return dynamic_cast<T*>(const_cast<Sequence>(seq)(i));
//}

//numseq& operator<<(numseq& seqomo, const Sequence* seq)
//{
//  seqomo = *dynamic_cast<numseq*>(const_cast<Sequence*>(seq));
//  return seqomo;
//}

#endif	// _SEQUENCEOMOGENEUS_H
