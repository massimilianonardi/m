package m.file;

import java.io.*;
import java.nio.*;
import java.nio.file.attribute.*;
import java.nio.channels.*;
import java.nio.file.*;
import java.util.*;

import m.object.*;
import m.stream.*;

public class OSFileSystemFindStream implements StreamInput
{
  protected Path path;
  DirectoryStream<Path> d;
  protected Iterator<Path> iterator;
  
  protected boolean eos = false;
  
  public OSFileSystemFindStream(String listPath) throws Exception
  {
//    this(listPath, new HashMap<String, String>());
    path = Paths.get(listPath).normalize();
    try(DirectoryStream<Path> ds = Files.newDirectoryStream(path))
    {
      iterator = ds.iterator();
      ds.close();
    }
    catch(Exception e)
    {
//      ds.close();
      throw e;
    }
    
    d = Files.newDirectoryStream(path);
    iterator = d.iterator();
  }
  
  public OSFileSystemFindStream(String findPath, Map options) throws Exception
  {
    path = Paths.get(findPath).normalize();
//    iterator = Files.walk(path, FileVisitOption.FOLLOW_LINKS).iterator();
    PathMatcher pathMatcher = FileSystems.getDefault().getPathMatcher("regex:.*");
    iterator = Files.walk(path, FileVisitOption.FOLLOW_LINKS).filter(pathMatcher::matches).iterator();
//    iterator = Files.find(path, Integer.MAX_VALUE, null).iterator();
  }
  
  public void close() throws Exception
  {
    d.close();
//    throw new Exception();
  }
  
  public boolean isObjStream() throws Exception
  {
    return true;
  }
  
  public boolean eos() throws Exception
  {
//    return eos;
    return !iterator.hasNext();
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
      close();
      return null;
    }
//    String value = iterator.next().toString();
    String value = path.relativize(iterator.next()).toString();
    if(!iterator.hasNext())
    {
      eos = true;
      close();
    }
    return new Obj(value);
  }
}
