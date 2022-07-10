package m.file;

import java.io.*;

import m.object.*;
import m.stream.*;

public class FileStream implements StreamSeekable, StreamObjectPositionable<ByteArray>
{
  protected String path;
  protected RandomAccessFile file;
  protected ByteArray buffer;
  protected String mode;
  
  protected boolean eos = false;
  
  public FileStream(String filePath) throws Exception
  {
    this(filePath, ByteArray.DEFAULT, true);
  }
  
  public FileStream(String filePath, boolean modifiable) throws Exception
  {
    this(filePath, ByteArray.DEFAULT, modifiable);
  }
  
  public FileStream(String filePath, int bufferSize, boolean modifiable) throws Exception
  {
    if(modifiable)
    {
      mode = "rws";
    }
    else
    {
      mode = "r";
    }
    buffer = new ByteArray(bufferSize);
    path = filePath;
    open();
  }
  
  public void open() throws Exception
  {
    m.Global.log.debug(path, mode);
    
    try
    {
      file = new RandomAccessFile(path, mode);
    }
    catch(Exception e)
    {
      close();
      throw e;
    }
  }
  
  public void close() throws Exception
  {
    file.close();
    file = null;
  }
  
  public void begin() throws Exception
  {
    position(0);
  }
  
  public void end() throws Exception
  {
    position(size() - 1);
  }
  
  public long size() throws Exception
  {
    return file.length();
  }
  
  public long position() throws Exception
  {
    return file.getFilePointer();
  }
  
  public void position(long position) throws Exception
  {
    file.seek(position);
    
    if(position() == size())
    {
      eos = true;
    }
    else
    {
      eos = false;
    }
  }
  
  public void seek(long seek) throws Exception
  {
    position(position() + seek);
  }
  
  public void size(long position) throws Exception
  {
    file.setLength(position);
  }
  
  public boolean eos() throws Exception
  {
//    return (position() == size());
    return eos;
  }
  
  public ByteArray readBytes() throws Exception
  {
    buffer.length(file.read(buffer.buffer()));
    if(buffer.length() == -1)
    {
      eos = true;
    }
    return buffer;
  }
  
  public void write(ByteArray buffer) throws Exception
  {
    file.write(buffer.buffer(), buffer.offset(), buffer.length());
  }
  
  //----------------------------------------------------------------------------
  
  public ByteArray readObject() throws Exception
  {
    buffer.length(file.read(buffer.buffer()));
    if(buffer.length() == -1)
    {
      eos = true;
    }
    return buffer;
  }
  
  public void writeObject(ByteArray buffer) throws Exception
  {
    file.write(buffer.buffer(), buffer.offset(), buffer.length());
  }
  
//  public void insertObject(ByteArray buffer) throws Exception
//  {
//    // not supported directly by filesystems, need to read and rewrite to new position the subsequent positions -> inacceptable performance
//    // may be acceptable with segmented files, or with a specific subclass that addresses this lack of functionality in a proper way
//    throw new Exception();
//  }
}
