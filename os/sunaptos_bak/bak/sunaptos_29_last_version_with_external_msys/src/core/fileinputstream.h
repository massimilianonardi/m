#ifndef FILEINPUTSTREAM_H
#define	FILEINPUTSTREAM_H

#include "streaminput.h"

class FileInputStream: virtual public StreamInput
{
  protected:
    FILE* f;
    
  public:
    FileInputStream(char* name);
    ~FileInputStream();
    
    void read(Buffer& buffer);
    long getReadPos();
    void setReadPos(long pos);
    bool bosi();
    bool eosi();
    long size();
};

#endif	/* FILEINPUTSTREAM_H */
