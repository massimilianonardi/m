#include "sequencepersistent.h"

SequencePersistent::SequencePersistent(const char* id)
{
  fs = new FileStream(id);
}

SequencePersistent::~SequencePersistent()
{
  delete fs;
}

void SequencePersistent::read()
{
  Sequence::read(fs);
}

void SequencePersistent::write()
{
  Sequence::write(fs);
}
