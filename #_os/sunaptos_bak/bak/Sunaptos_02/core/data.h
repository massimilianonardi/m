#ifndef _DATA_H
#define	_DATA_H

class Data
{
  protected:
    int t;
    unsigned long s;
    void* b;

  public:
    static const int tl = 0;
    static const int tc = 1;
    static const int tv = 2;
    // todo: add other types (containers, arrays, etc.)

    Data(int type, unsigned long size, void* buf);
    virtual ~Data();
    
    int type(); // type of data
    unsigned long size(); // size of the buf (no. of bytes)
    const void* buf(); // buffer pointer
    
    long l() throw (const char*); // returns a cast to long of the content if type is long, throws an exception otherwise
    char* c() throw (const char*); // returns the pointer casted to char* if type is char, throws an exception otherwise
    void* v() throw (const char*); // returns the pointer casted to void* if type is custom, throws an exception otherwise
};

#endif	// _DATA_H
