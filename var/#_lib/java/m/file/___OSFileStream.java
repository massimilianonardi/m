package m.file;

import java.io.*;

import m.object.*;
import m.stream.*;

public class ___OSFileStream implements StreamSeekable
{
  protected String path;
  protected RandomAccessFile file;
  protected ByteArray buffer;
  
  public ___OSFileStream(String filePath) throws Exception
  {
    this(filePath, ByteArray.DEFAULT);
  }
  
  public ___OSFileStream(String filePath, int bufferSize) throws Exception
  {
    buffer = new ByteArray(bufferSize);
    
    path = filePath;
    file = new RandomAccessFile(path, "rws");
  }
  
  public void close() throws Exception
  {
    file.close();
    file = null;
  }
  
  public void begin() throws Exception
  {
    file.getChannel().position(0);
  }
  
  public void end() throws Exception
  {
    file.getChannel().position(file.getChannel().size());
  }
  
  public long size() throws Exception
  {
    return file.getChannel().size();
  }
  
  public long position() throws Exception
  {
    return file.getChannel().position();
  }
  
  public void position(long position) throws Exception
  {
    file.getChannel().position(position);
  }
  
  public void seek(long seek) throws Exception
  {
    file.getChannel().position(file.getChannel().position() + seek);
  }
  
  public void size(long position) throws Exception
  {
    file.getChannel().truncate(position);
  }
  
  public boolean eos() throws Exception
  {
    long pos = position();
    long sz = size();
    if(pos == sz)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
  
  public ByteArray readBytes() throws Exception
  {
    buffer.length(file.read(buffer.buffer()));
    
    return buffer;
  }
  
  public void write(ByteArray buffer) throws Exception
  {
    file.write(buffer.buffer(), buffer.offset(), buffer.length());
  }
}
