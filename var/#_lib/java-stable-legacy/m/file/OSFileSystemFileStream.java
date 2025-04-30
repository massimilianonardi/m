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
  
  protected boolean eos = false;
  
  public OSFileSystemFileStream(String filePath) throws Exception
  {
    this(filePath, ByteArray.DEFAULT);
  }
  
  public OSFileSystemFileStream(String filePath, int bufferSize) throws Exception
  {
    this(Paths.get(filePath), ByteArray.DEFAULT);
  }
  
  public OSFileSystemFileStream(Path filePath) throws Exception
  {
    this(filePath, ByteArray.DEFAULT);
  }
  
  public OSFileSystemFileStream(Path filePath, int bufferSize) throws Exception
  {
    buffer = new ByteArray(bufferSize);
    path = filePath.normalize();
    m.Global.log.debug(filePath.toString(), path.toString());
    open();
  }
  
  public void open() throws Exception
  {
    m.Global.log.debug(path.toString(), path.toAbsolutePath().toString());
    try
    {
      file = new RandomAccessFile(path.toAbsolutePath().toString(), "rws");
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
