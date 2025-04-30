#include "number.h"
#include <string.h>

Number::Number()
{
  num = 0;
}

Number::Number(double n)
{
  *this = n;
}

Number::Number(Text t)
{
  *this = t;
}

Number::~Number()
{
}

void Number::read(StreamInput* si)
{
  // todo: type, size, wide
  Buffer b;
  b.resize(sizeof(num));
  si->read(&b);
  memcpy(&num, b.get(), sizeof(num));
}

void Number::write(StreamOutput* so)
{
  // todo: type, size, wide
  Buffer b;
  b.set(&num, sizeof(num));
  so->write(&b);
}

Number Number::type()
{
  // todo: implement
  return Number(0);
}

Number Number::size()
{
  return wide();
}

Number Number::wide()
{
  return Number(sizeof(num));
}

Text Number::text()
{
  // todo: implement
  return Text();
}

double Number::get()
{
  return num;
}

void Number::set(double n)
{
  *this = n;
}

void Number::set(const void* n, Number& w)
{
  // todo: implement
}

void Number::set(const void* n, Number& w, Number& t)
{
  // todo: implement
}

void Number::set(const Number& n)
{
  *this = n;
}

Number& Number::operator=(const Number& n)
{
  if(&n == this)
  {
    return *this;
  }
  else
  {
    num = n.num;

    return *this;
  }
}

Number& Number::operator=(double n)
{
  num = n;

  return *this;
}

Number& Number::operator=(const Text& t)
{
  // todo: implement

  return *this;
}

Number& Number::operator++()
{
  num++;

  return *this;
}

Number Number::operator++(int)
{
  Number res(num);
  num++;

  return res;
}

Number& Number::operator--()
{
  num--;

  return *this;
}

Number Number::operator--(int)
{
  Number res(num);
  num--;

  return res;
}

Number Number::operator+(const Number& n) const
{
  return Number(num + n.num);
}

Number Number::operator-(const Number& n) const
{
  return Number(num - n.num);
}

Number Number::operator*(const Number& n) const
{
  return Number(num * n.num);
}

Number Number::operator/(const Number& n) const
{
  return Number(num / n.num);
}

bool Number::operator==(const Number& n) const
{
  return num == n.num;
}

bool Number::operator!=(const Number& n) const
{
  return num != n.num;
}

bool Number::operator<(const Number& n) const
{
  return num < n.num;
}

bool Number::operator>(const Number& n) const
{
  return num > n.num;
}

bool Number::operator<=(const Number& n) const
{
  return num <= n.num;
}

bool Number::operator>=(const Number& n) const
{
  return num >= n.num;
}
