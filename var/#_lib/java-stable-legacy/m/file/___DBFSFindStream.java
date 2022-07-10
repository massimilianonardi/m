package m.file;

import java.io.*;
import java.nio.*;
import java.nio.file.attribute.*;
import java.nio.channels.*;
import java.nio.file.*;
import java.util.*;

import m.object.*;
import m.stream.*;

public class ___DBFSFindStream implements StreamInput
{
  protected Path path;
  protected Iterator<Path> iterator;
  
  protected boolean eos = false;
  
  public ___DBFSFindStream(String findPath) throws Exception
  {
    this(findPath, new HashMap<String, String>());
  }
  
  public ___DBFSFindStream(String findPath, Map options) throws Exception
  {
  }
  
  public void close() throws Exception
  {
    throw new Exception();
  }
  
  public boolean isObjStream() throws Exception
  {
    return true;
  }
  
  public boolean eos() throws Exception
  {
    return eos;
  }
  
  public ByteArray readBytes() throws Exception
  {
    return readObj().bytes();
  }
  
  public Obj readObj() throws Exception
  {
    if(!iterator.hasNext())
    {
      eos = true;
      return null;
    }
//    String value = iterator.next().toString();
    String value = path.relativize(iterator.next()).toString();
    if(!iterator.hasNext())
    {
      eos = true;
    }
    return new Obj(value);
  }
}
