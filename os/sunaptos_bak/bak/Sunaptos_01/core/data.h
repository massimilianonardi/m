#ifndef _DATA_H
#define	_DATA_H

class Data
{
  public:
    virtual ~Data(){};
    
    // todo: implement this interface (the following method is just an example)
    virtual Data* getSubData(Data* data) = 0;
};

#endif	// _DATA_H
