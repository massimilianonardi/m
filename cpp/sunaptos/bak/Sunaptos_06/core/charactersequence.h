#ifndef _CHARACTERSEQUENCE_H
#define	_CHARACTERSEQUENCE_H

#include "character.h"
#include "streamable.h"

// CharacterSequence uses only Character inputs that is complex (even if complexity is 1) because is the most
// general case, only Character can rely on basic character
class CharacterSequence: virtual public Streamable
{
  protected:
    Character t;
    Character s;
    Character w;
    Character z; // index of zero-index
    void* pb;
//    Memory m;

  public:
    CharacterSequence(); // defaults to size=wide=0
//    CharacterSequence(Character& wide, Character& size, Memory& c); // initialized with array c
//    CharacterSequence(double c); // initialized with wide = sizeof(double) or should i align to character?
//    CharacterSequence(const char* c); // initialized with wide = sizeof(char) and the provided character array
//    CharacterSequence(const wchar_t* c); // initialized with wide = sizeof(wchar_t) and the provided character array
//    virtual ~CharacterSequence();
//
//    void read(StreamInput* si);
//    void write(StreamOutput* so);
//
//    Character type();
//    Character size();
//    Character wide();
//
//    const void* get();
//    void set(character wide, character size, const void* c);
//    void set(Character& wide, Character& size, Memory& c);
//
//    CharacterSequence& operator=(const CharacterSequence& c);
//    CharacterSequence& operator=(double c); // no use of character here, character is used with []
//    CharacterSequence& operator=(const char* c);
//    CharacterSequence& operator=(const wchar_t* c);

//    CharacterSequence& operator++(); // ++ on first char (recursion for compl.ch)
//    CharacterSequence operator++(int);
//    CharacterSequence& operator--();
//    CharacterSequence operator--(int);

//    CharacterSequence operator+(const CharacterSequence& c) const; // sum char to char (compl.ch recursion)
//    CharacterSequence operator-(const CharacterSequence& c) const;
//    CharacterSequence operator*(const CharacterSequence& c) const;
//    CharacterSequence operator/(const CharacterSequence& c) const;
//    CharacterSequence operator%(const CharacterSequence& c) const;
//
//    CharacterSequence operator&(const CharacterSequence& c) const; // append
//
//    bool operator==(const CharacterSequence& c) const;
//    bool operator!=(const CharacterSequence& c) const;
//    bool operator<(const CharacterSequence& c) const; // sizes, right to left comparison (recursion) -> compl.ch comp
//    bool operator>(const CharacterSequence& c) const;
//    bool operator<=(const CharacterSequence& c) const;
//    bool operator>=(const CharacterSequence& c) const;
};

#endif	// _CHARACTERSEQUENCE_H
