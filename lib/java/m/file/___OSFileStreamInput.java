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

public class ___OSFileStreamInput implements StreamSeekableInput
{
  protected String path;
  protected RandomAccessFile file;
  protected ByteArray buffer;
  
//  protected boolean eos = false;
  
  public ___OSFileStreamInput(String filePath) throws Exception
  {
    this(filePath, ByteArray.DEFAULT);
  }
  
  public ___OSFileStreamInput(String filePath, int bufferSize) throws Exception
  {
    buffer = new ByteArray(bufferSize);
    
    path = filePath;
//    file = new RandomAccessFile(path, "rws");
    file = new RandomAccessFile(path, "r");
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
  
  public boolean eos() throws Exception
  {
//    return (position() == size());
//    return eos;
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
//    if(buffer.length() == -1)
//    {
//      eos = true;
//    }
    return buffer;
  }
}
