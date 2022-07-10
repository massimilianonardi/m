#ifndef _NUMBER_H
#define	_NUMBER_H

typedef double number;
typedef char num8;
typedef char num16[2];
typedef char num32[4];

#include "streamable.h"
#include "text.h"

class Text;

union NumericType
{
  bool b;
  
  char c;
  wchar_t w;
  
  int i;
  long l;
  long long ll;

  float f;
  double d;
  long double ld;
};

class Text;

class Number: virtual public Streamable
{
  protected:
//    NumericType num;
    double num;

  public:
    Number();
//    Number(long n);
//    Number(long long n);
//    Number(float n);
    Number(double n);
//    Number(long double n);
    Number(Text t);
    virtual ~Number();

    void read(StreamInput* si);
    void write(StreamOutput* so);

    Number type();
    Number size();
    Number wide();

    Text text();
    
    double get(); // this method returns the most natural/useful type and NOT the widest
    void set(double n); // default type assumed
    void set(const void* n, Number& w);
    void set(const void* n, Number& w, Number& t);
    void set(const Number& n);
    void set(const Text& t);

    // todo: check if is infinite, if NaN, etc.

    Number& operator=(const Number& n);
//    Number& operator=(long n);
//    Number& operator=(long long n);
//    Number& operator=(float n);
    Number& operator=(double n);
//    Number& operator=(long double n);
    Number& operator=(const Text& t);

    // every other operator acts only on Number objects, no basic data types (use get or create a new object)
    Number& operator++();
    Number operator++(int);
    Number& operator--();
    Number operator--(int);

    Number operator+(const Number& n) const;
    Number operator-(const Number& n) const;
    Number operator*(const Number& n) const;
    Number operator/(const Number& n) const;
    Number operator%(const Number& n) const;

    bool operator==(const Number& n) const;
    bool operator!=(const Number& n) const;
    bool operator<(const Number& n) const;
    bool operator>(const Number& n) const;
    bool operator<=(const Number& n) const;
    bool operator>=(const Number& n) const;

    // todo: define every numeric operator

    // todo: define operators << and >> to assign/get formatted values just like std streams and not bitwise ops
};

#endif	// _NUMBER_H
