#ifndef FILEINPUTSTREAM_H
#define	FILEINPUTSTREAM_H

class FileInputStream: virtual public StreamInput
{
  protected:
    FILE* f;
    
  public:
    FileInputStream(Sequence& params);
    ~FileInputStream();
    
    void read(Buffer& buffer);
    long getReadPos();
    void setReadPos(long pos);
    bool bosi();
    bool eosi();
    long size();
};

#endif	/* FILEINPUTSTREAM_H */
