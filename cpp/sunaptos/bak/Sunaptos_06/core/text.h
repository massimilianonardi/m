#ifndef _TEXT_H
#define	_TEXT_H

#include "streamable.h"
#include "number.h"

#include <string>

class Number;

class Text: virtual public Streamable
{
  protected:
    std::wstring s;

  public:
    Text();
    Text(const char* c);
    Text(const wchar_t* c);
    Text(const void* c, Number& w);
    Text(const void* c, Number& w, Number& t);
    virtual ~Text();

    void read(StreamInput* si);
    void write(StreamOutput* so);

    Number type();
    Number size();
    Number wide();

    Text text();

    const wchar_t* get();
    const char* getchar();
    void set(const char* c); // ascii encoding assumed
    void set(const wchar_t* c); // unicode assumed
    void set(const void* c, Number& w); // undefined type, no assumptions, NB it may not allow operations
    void set(const void* c, Number& w, Number& t);
    void set(Text& t);

    Text& operator=(const Text& t);
    Text& operator=(const char* t);
    Text& operator=(const wchar_t* t);

    Text operator+(const Text& t) const;

    bool operator==(const Text& t) const;
    bool operator!=(const Text& t) const;
    bool operator<(const Text& t) const;
    bool operator>(const Text& t) const;
    bool operator<=(const Text& t) const;
    bool operator>=(const Text& t) const;
};

#endif	// _TEXT_H
