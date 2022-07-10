#include "charactersequence.h"
#include <string>

CharacterSequence::CharacterSequence()
{
  pb = 0;
}

//CharacterSequence::CharacterSequence(Character& wide, Character& size, Memory& c)
//{
//  pb = 0;
////  set(wide, size, c.get());
//}
//
//CharacterSequence::CharacterSequence(double c)
//{
//  pb = 0;
//  set(sizeof(double), 1, &c);
//}
//
//CharacterSequence::CharacterSequence(const char* c)
//{
//  pb = 0;
////  std::string s = c;
////  set(sizeof(char), s.size(), c);
//  set(sizeof(char), std::string(c).size(), c);
//}
//
//CharacterSequence::CharacterSequence(const wchar_t* c)
//{
//  pb = 0;
//  set(sizeof(wchar_t), std::wstring(c).size(), c);
//}
//
//CharacterSequence::~CharacterSequence()
//{
//  // todo: implement, deallocate memory, etc.
//  free(pb);
//  pb = 0;
//}
//
//void CharacterSequence::read(StreamInput* si)
//{
//  // todo: implement
//}
//
//void CharacterSequence::write(StreamOutput* so)
//{
//  // todo: implement
//}
//
//Character CharacterSequence::type()
//{
//  // todo: implement
//  return Character();
//}
//
//Character CharacterSequence::size()
//{
//  // todo: implement
//  return Character();
//}
//
//Character CharacterSequence::wide()
//{
//  // todo: implement
//  return Character();
//}
//
//const void* CharacterSequence::get()
//{
//  return pb;
//}
//
//void CharacterSequence::set(character wide, character size, const void* c)
//{
//  pb = realloc(pb, wide * size);
//  memcpy(pb, c, wide * size);
//}
//
//void CharacterSequence::set(Character& wide, Character& size, Memory& c)
//{
//  // todo: implement
//}
//
//CharacterSequence& CharacterSequence::operator=(const CharacterSequence& c)
//{
//  if(&c == this)
//  {
//    return *this;
//  }
//  else
//  {
////    num = n.num;
//
//    return *this;
//  }
//}
