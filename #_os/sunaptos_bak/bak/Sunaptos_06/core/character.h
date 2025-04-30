#ifndef _CHARACTER_H
#define	_CHARACTER_H

typedef double character;

// Character is a complex character and only a convenience to c++ arrays
// this simple implementation only wraps a character (double), later implemetation should be serious
class Character
{
  protected:
    character b;
    
  public:
    Character();
    Character(character c);
    virtual ~Character();

//    character size();
//    character wide();
//
    character* get();
//    character get(character ordinalpos);
//    void set(character* c);
//    void set(character c, character ordinalpos);
//
//    void resize(character wide);
};

#endif	// _CHARACTER_H
