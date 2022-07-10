package m.file;

import java.util.*;

import m.conf.*;
import m.stream.*;

//public class MultiMountFS extends ConfigurableMap<FileSystem> implements FileSystem
public class ___MultiMountFS extends ConfigurableWrapper<___FileSystem> implements ___FileSystem
{
  public String root() throws Exception
  {
    return object.root();
  }
  
  public String file() throws Exception
  {
    return object.file();
  }
  
  // attributes
  public Attributes attributes(String path) throws Exception
  {
    return object.attributes(path);
  }
  
  public void attributes(String path, Attributes attributes) throws Exception
  {
    object.attributes(path, attributes);
  }
  
  // direct queries
  public boolean exists(String path) throws Exception
  {
    return object.exists(path);
  }
  
  public boolean isFile(String path) throws Exception
  {
    return object.isFile(path);
  }
  
  public boolean isNode(String path) throws Exception
  {
    return object.isNode(path);
  }
  
  public boolean isSymbolicLink(String path) throws Exception
  {
    return object.isSymbolicLink(path);
  }
  
  public String parent(String path) throws Exception
  {
    return object.parent(path);
  }
  
  // all object types operations
  public void move(String path, String dest, boolean replace) throws Exception
  {
    object.move(path, dest, replace);
  }
  
  public void rename(String path, String name) throws Exception
  {
    object.rename(path, name);
  }
  
  public void copy(String path, String dest, boolean replace, boolean follow) throws Exception
  {
    object.copy(path, dest, replace, follow);
  }
  
  public void delete(String path, boolean deep) throws Exception
  {
    object.delete(path, deep);
  }
  
  // objects
  public void file(String path) throws Exception
  {
    object.file(path);
  }
  
  public StreamSeekable stream(String path) throws Exception
  {
    return object.stream(path);
  }
  
  public void node(String path) throws Exception
  {
    object.node(path);
  }
  
  public void nodes(String path) throws Exception
  {
    object.nodes(path);
  }
  
  public StreamInput list(String path) throws Exception
  {
    return object.list(path);
  }
  
  public StreamInput find(String path, Map options) throws Exception
  {
    return object.find(path, options);
  }
  
  public void link(String path, String dest) throws Exception
  {
    object.link(path, dest);
  }
  
  public void symlink(String path, String dest) throws Exception
  {
    object.symlink(path, dest);
  }
  
  public String symlink(String path) throws Exception
  {
    return object.symlink(path);
  }
}
