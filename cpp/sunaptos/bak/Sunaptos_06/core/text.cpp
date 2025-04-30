#include "text.h"
//#include <memory>

Text::Text()
{
  set("");
}

Text::Text(const char* c)
{
  set(c);
}

Text::Text(const wchar_t* c)
{
  set(c);
}

Text::Text(const void* c, Number& w)
{
  // todo: implement
}

Text::Text(const void* c, Number& w, Number& t)
{
  // todo: implement
}

Text::~Text()
{
}

void Text::read(StreamInput* si)
{
  // todo: type, wide
  Buffer b;

  Number vs = Number(0);
  vs.read(si);
  long len = (long) vs.get();

  b.resize(len);
  si->read(&b);
  s = (wchar_t*) b.get();
}

void Text::write(StreamOutput* so)
{
  // todo: type, wide
  Buffer b;

  long len = size().get() + 1;
  Number vs = Number(len);
  vs.write(so);

  b.set(get(), len);
  so->write(&b);
}

Number Text::type()
{
  // todo: implement
  return 0;
}

Number Text::size()
{
  return Number(s.size());
}

Number Text::wide()
{
  return Number(sizeof(wchar_t));
}

Text Text::text()
{
  return *this;
}

const wchar_t* Text::get()
{
  return s.c_str();
}

const char* Text::getchar()
{
  std::string tmp = std::string(tmp.length(), ' ');
  std::copy(s.begin(), s.end(), tmp.begin());
  return tmp.c_str();
}

void Text::set(const char* c)
{
  std::string tmp = c;
  s = std::wstring(tmp.length(), L' ');
  std::copy(tmp.begin(), tmp.end(), s.begin());
}

void Text::set(const wchar_t* c)
{
  s = c;
}

void Text::set(const void* c, Number& w)
{
  // todo: implement
}

void Text::set(const void* c, Number& w, Number& t)
{
  // todo: implement
}

Text Text::operator+(const Text& t) const
{
  return Text((s + t.s).c_str());
}

bool Text::operator==(const Text& t) const
{
  return s == t.s;
}

bool Text::operator!=(const Text& t) const
{
  return s != t.s;
}

bool Text::operator<(const Text& t) const
{
  return s < t.s;
}

bool Text::operator>(const Text& t) const
{
  return s > t.s;
}

bool Text::operator<=(const Text& t) const
{
  return s <= t.s;
}

bool Text::operator>=(const Text& t) const
{
  return s >= t.s;
}
