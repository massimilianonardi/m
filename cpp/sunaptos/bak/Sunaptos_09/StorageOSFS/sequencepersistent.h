#ifndef _SEQUENCEPERSISTENT_H
#define	_SEQUENCEPERSISTENT_H

#include "number.h"
#include "sequence.h"
#include "filestream.h"

class SequencePersistent: virtual public Sequence
{
  protected:
    FileStream* fs;

    void init();
    void close();

  public:
    SequencePersistent(const char* id);
    virtual ~SequencePersistent();

    void read();
    void write();
};

#endif	// _SEQUENCEPERSISTENT_H
