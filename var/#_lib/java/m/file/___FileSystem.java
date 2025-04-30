package m.file;

import java.nio.file.attribute.*;
import java.util.*;

import m.stream.*;

public interface ___FileSystem extends ___FileSystemIndexed
{
  public interface Attributes extends BasicFileAttributes
  {
  }
  
  public String root() throws Exception;
  
  public Attributes attributes(String path) throws Exception;
  public void attributes(String path, Attributes attributes) throws Exception;
  public boolean exists(String path) throws Exception;
  public boolean isFile(String path) throws Exception;
  public boolean isNode(String path) throws Exception;
  public boolean isSymbolicLink(String path) throws Exception;
  public String parent(String path) throws Exception;
  
  default public void move(String path, String dest) throws Exception
  {
    move(path, dest, false);
  }
  
  public void move(String path, String dest, boolean replace) throws Exception;
  public void rename(String path, String name) throws Exception;
  
  default public void copy(String path, String dest) throws Exception
  {
    copy(path, dest, false, false);
  }
  
  public void copy(String path, String dest, boolean replace, boolean follow) throws Exception;
  
  default public void delete(String path) throws Exception
  {
    delete(path, false);
  }
  
  public void delete(String path, boolean deep) throws Exception;
  public void file(String path) throws Exception;
  public StreamSeekable stream(String path) throws Exception;
  public void node(String path) throws Exception;
  public void nodes(String path) throws Exception;
  public StreamInput list(String path) throws Exception;
  public StreamInput find(String path, Map options) throws Exception;
  public void link(String path, String dest) throws Exception;
  public void symlink(String path, String dest) throws Exception;
  public String symlink(String path) throws Exception;
  
//  // attributes
//  default public FileSystemAttributes attributes(String path) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void attributes(String path, FileSystemAttributes attributes) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  // direct queries
//  default public boolean exists(String path) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public boolean isFile(String path) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public boolean isNode(String path) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public boolean isSymbolicLink(String path) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public String parent(String path) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  // all object types operations
//  default public void move(String path, String dest) throws Exception
//  {
//    move(path, dest, false);
//  }
//  
//  default public void move(String path, String dest, boolean replace) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void rename(String path, String name) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void copy(String path, String dest) throws Exception
//  {
//    copy(path, dest, false, false);
//  }
//  
//  default public void copy(String path, String dest, boolean replace, boolean follow) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void delete(String path) throws Exception
//  {
//    delete(path, false);
//  }
//  
//  default public void delete(String path, boolean deep) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  // objects
//  default public void file(String path) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public StreamSeekable stream(String path) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void node(String path) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void nodes(String path) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public StreamInput list(String path) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public StreamInput find(String path, Map options) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void link(String path, String dest) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void symlink(String path, String dest) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public String symlink(String path) throws Exception
//  {
//    throw new Exception();
//  }
}
