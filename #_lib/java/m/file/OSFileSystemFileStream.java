package m.file;

import java.io.*;
import java.nio.*;
import java.nio.file.attribute.*;
import java.nio.channels.*;
import java.nio.file.*;
import java.util.*;

import m.object.*;
import m.stream.*;
import m.util.*;

public class OSFileSystemFileStream implements StreamSeekable
{
  protected Path path;
  protected RandomAccessFile file;
  protected ByteArray buffer;
  protected String mode;
  
  protected boolean eos = false;
  
  public OSFileSystemFileStream(String filePath) throws Exception
  {
    this(filePath, ByteArray.DEFAULT, false);
  }
  
  public OSFileSystemFileStream(String filePath, boolean modifiable) throws Exception
  {
    this(filePath, ByteArray.DEFAULT, modifiable);
  }
  
  public OSFileSystemFileStream(String filePath, int bufferSize, boolean modifiable) throws Exception
  {
    this(Paths.get(filePath), ByteArray.DEFAULT, modifiable);
  }
  
  public OSFileSystemFileStream(Path filePath, boolean modifiable) throws Exception
  {
    this(filePath, ByteArray.DEFAULT, modifiable);
  }
  
  public OSFileSystemFileStream(Path filePath, int bufferSize, boolean modifiable) throws Exception
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
    path = filePath.normalize();
    open();
  }
  
  public void open() throws Exception
  {
    m.Global.log.debug(path.toString(), path.toAbsolutePath().toString(), mode);
    try
    {
      file = new RandomAccessFile(path.toString(), mode);
    }
    catch(Exception e)
    {
      close();
      throw e;
    }
  }
  
  public void close() throws Exception
  {
    if(file != null)
    {
      file.close();
      file = null;
    }
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
}
