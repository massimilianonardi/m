#ifndef FILEOUTPUTSTREAM_H
#define	FILEOUTPUTSTREAM_H

class FileOutputStream: virtual public StreamOutput
{
  protected:
    FILE* f;
    
  public:
    FileOutputStream(Sequence& params);
    ~FileOutputStream();

    void write(Buffer& buffer);
    long getWritePos();
    void setWritePos(long pos);
    bool boso();
    bool eoso();
    long size();
};

#endif	/* FILEOUTPUTSTREAM_H */
