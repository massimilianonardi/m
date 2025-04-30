#include "sequence.h"

sequence_element::sequence_element(element& element): e(&element), is_seq(false) {}
sequence_element::sequence_element(sequence& sequence): s(&sequence), is_seq(true) {}
sequence_element::operator element*() {return e;}
sequence_element::operator sequence*() {return s;}
sequence_element::operator element&() {return *e;}
sequence_element::operator sequence&() {return *s;}
sequence_element& sequence_element::operator=(element& element) {e = &element; is_seq = false; return *this;};
sequence_element& sequence_element::operator=(sequence& sequence) {s = &sequence; is_seq = true; return *this;};
bool sequence_element::is_sequence() {return is_seq;}
element& sequence_element::elem() {return *e;};
//sequence& sequence_element::seq() {if(!is_seq){sequence seq; return seq;}; return *s;}
sequence& sequence_element::seq() {if(!is_seq){is_seq = true; return *(new sequence());}; return *s;}

sequence::sequence(): t(sequence_type::unspecified_t)
{
}

sequence::~sequence()
{
  // todo: delete all sequence pointers created by sequence when adding strings (char and wchar)
  // todo: find a way to avoid the "new sequence" constructs used with strings...that is avoid strings!!!
  // using new inside sequence means that responsibility for sequence pointers cleanup is no longer user's solely,
  // thus sequence must know what to delete when calling destructor or "del", but even so, there is ambiguity because
  // sequence cannot know if user still needs a pointer...
}

// copy
//sequence::sequence(sequence& seq)
//{
//  copy(seq);
//}
//
//sequence::sequence(const sequence& seq)
//{
//  *this = seq;
//}
//
//sequence& sequence::operator=(sequence e)
//{
//  return copy(e);
//}
//
//sequence& sequence::operator=(sequence& e)
//{
//  return copy(e);
//}
//
//sequence& sequence::copy(sequence& e)
//{
//  if((long) e.size() != 0)
//  {
//    vse = e.vse;
//  }
//  return *this;
//}

// type conversions
sequence::sequence(int e)
{
  *this = e;
}

sequence::sequence(long e)
{
  *this = e;
}

sequence::sequence(long long e)
{
  *this = e;
}

sequence::sequence(float e)
{
  *this = e;
}

sequence::sequence(double e)
{
  *this = e;
}

sequence::sequence(long double e)
{
  *this = e;
}

sequence::sequence(const char* e)
{
  *this = e;
}

sequence::operator int()
{
  return *(int*) b;
}

sequence::operator long()
{
  return *(long*) b;
}

sequence::operator long long()
{
  return *(long long*) b;
}

sequence::operator float()
{
//  return *(float*) b;
  return *(long double*) b;
}

sequence::operator double()
{
//  return *(double*) b;
  return *(long double*) b;
}

sequence::operator long double()
{
  return *(long double*) b;
}

sequence::operator const char*()
{
  char* pc = (char*)(element*) get(0);
  if(pc == 0)
  {
//    pc = b;
    pc = "";
  }
  return pc;
}

sequence& sequence::operator=(int e)
{
  return *this = (long long) e;
}

sequence& sequence::operator=(long e)
{
  return *this = (long long) e;
}

sequence& sequence::operator=(long long e)
{
//  resize((long) sizeof(long long));
  element elem = 0;
  sequence_element se = elem;
  vse.resize((long) sizeof(long long), se);
  memcpy(b, &e, sizeof(long long));
  t = sequence_type::integer_t;
  return *this;
}

sequence& sequence::operator=(float e)
{
  return *this = (long double) e;
}

sequence& sequence::operator=(double e)
{
  return *this = (long double) e;
}

sequence& sequence::operator=(long double e)
{
//  resize((long) sizeof(long double));
//  vse.resize((long) sizeof(long double), (element*) 0);
  element elem = 0;
  sequence_element se = elem;
  vse.resize((long) sizeof(long long), se);
  memcpy(b, &e, sizeof(long double));
  t = sequence_type::floating_point_t;
  return *this;
}

sequence& sequence::operator=(const char* e)
{
  *this = (long double) 0;
//  resize((long) strlen(e));
//  vse.resize((long) strlen(e), (element*) 0);
  element elem = 0;
  sequence_element se = elem;
  vse.resize((long) sizeof(long long), se);
  get(0) = *(element*) e;
  t = sequence_type::string_ascii_t;
  return *this;
}

// access
//sequence_element& sequence::get(sequence& i)
sequence_element& sequence::get(sequence i)
{
  long ind = i;
  if(ind < 0)
  {
    throw 0;
  }
  else if(vse.size() <= ind)
  {
    resize(ind + 1);
  }
  return vse[ind];
}

sequence& sequence::del(sequence& i)
{
  vse.erase(vse.begin() + (long) i);
  return *this;
}

//void sequence::resize(sequence& size)
void sequence::resize(sequence size)
{
//  vse.resize((long) size, (element*) 0);
  element elem = 0;
  sequence_element se = elem;
  vse.resize((long) size, se);
}

sequence sequence::size()
{
  return (long) vse.size();
}

char* sequence::text()
{
  stringstream s;
  
  s << " [type: " << this->t << " - size: " << (long) size() << "] ";
  s << " [int: " << (int) *this << "] ";
  s << " [long: " << (long) *this << "] ";
  s << " [long long: " << (long long) *this << "] ";
  s << " [float: " << (float) *this << "] ";
  s << " [double: " << (double) *this << "] ";
  s << " [long double: " << (long double) *this << "] ";
  s << " [char*: " << (const char*) *this << "] ";
  s << "\n";

  for(int i = 0; i < (long) size(); ++i)
  {
//    s << "[element " << i << ": " << (int) get(i).elem() << "]\n";
    if(get(i).is_sequence())
    {
      s << "[element " << i << " is a sequence:]";
      s << get(i).seq().text();
    }
    else
    {
//      s << "[element " << i << "]";
    }
  }
//  s << "\n";
  return (char*) s.str().c_str();
}
