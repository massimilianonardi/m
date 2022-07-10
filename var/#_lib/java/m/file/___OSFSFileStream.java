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

public class ___OSFSFileStream implements StreamSeekable
{
  protected Path path;
  protected RandomAccessFile file;
  protected ByteArray buffer;
  
  public boolean deleteOnClose = false;
  
  protected boolean eos = false;
  
  public ___OSFSFileStream(String filePath) throws Exception
  {
    this(filePath, ByteArray.DEFAULT);
  }
  
  public ___OSFSFileStream(String filePath, int bufferSize) throws Exception
  {
    this(Paths.get(filePath), ByteArray.DEFAULT);
  }
  
  public ___OSFSFileStream(Path filePath) throws Exception
  {
    this(filePath, ByteArray.DEFAULT);
  }
  
  public ___OSFSFileStream(Path filePath, int bufferSize) throws Exception
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
    if(file == null)
    {
      return;
    }
    
    file.close();
    file = null;
    if(deleteOnClose == true)
    {
      Files.delete(path);
    }
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
