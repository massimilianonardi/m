#ifndef SUNAPTOSPROCESS_H
#define	SUNAPTOSPROCESS_H

#include "kernel.h"
#include "sequence.h"

class SunaptosProcess
{
//  protected:
//    Kernel* l;

  public:
    SunaptosProcess();
    ~SunaptosProcess();

    void init(Sequence& p);
};

#endif	/* SUNAPTOSPROCESS_H */

