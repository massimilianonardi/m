#ifndef _COMMANDLISTENER_H
#define	_COMMANDLISTENER_H

#include "object.h"
#include "data.h"

class CommandListener: virtual public Object
{
  public:
    virtual ~CommandListener(){};
    
    // todo: implement it as a standard iface
    // todo: verify the following behaviuor to require -> accept a CDT and process it then returns the result as a CDT
    // todo: use proper CDT object (also derived from object) instead of "Object" -> a definition of CDT objects and structure is 
    //       required to be implemented (cfr. CDT requirements)
    virtual Data* processCommand(int cmd, Data* data) = 0;
};

#endif	// _COMMANDLISTENER_H
