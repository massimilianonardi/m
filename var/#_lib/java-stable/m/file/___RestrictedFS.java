package m.file;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.stream.*;

public class ___RestrictedFS extends ConfigurableWrapper<___FileSystem> implements ___FileSystem
{
  protected String root;
  
  public void configure(Obj conf) throws Exception
  {
    root = conf.string(Conf.ROOT);
    
    if(root == null)
    {
      root = "";
    }
    
    if(conf.get(Conf.FILESYSTEM) == null)
    {
      super.configure(conf);
    }
    else
    {
      super.configure(conf.get(Conf.FILESYSTEM));
    }
  }
  
  public String root() throws Exception
  {
    return root;
  }
  
  protected String restrictPath(String path) throws Exception
  {
    String p = java.nio.file.Paths.get(path).normalize().toString();
    if(p.startsWith(".."))
    {
      throw new Exception();
    }
    
    return root + "/" + path;
  }
  
  public String file() throws Exception
  {
    return object.file();
  }
  
  // attributes
  public Attributes attributes(String path) throws Exception
  {
    return object.attributes(restrictPath(path));
  }
  
  public void attributes(String path, Attributes attributes) throws Exception
  {
    object.attributes(restrictPath(path), attributes);
  }
  
  // direct queries
  public boolean exists(String path) throws Exception
  {
    return object.exists(restrictPath(path));
  }
  
  public boolean isFile(String path) throws Exception
  {
    return object.isFile(restrictPath(path));
  }
  
  public boolean isNode(String path) throws Exception
  {
    return object.isNode(restrictPath(path));
  }
  
  public boolean isSymbolicLink(String path) throws Exception
  {
    return object.isSymbolicLink(restrictPath(path));
  }
  
  public String parent(String path) throws Exception
  {
    return object.parent(restrictPath(path));
  }
  
  // all object types operations
  public void move(String path, String dest, boolean replace) throws Exception
  {
    object.move(restrictPath(path), restrictPath(dest), replace);
  }
  
  public void rename(String path, String name) throws Exception
  {
    object.rename(restrictPath(path), name);
  }
  
  public void copy(String path, String dest, boolean replace, boolean follow) throws Exception
  {
    object.copy(restrictPath(path), restrictPath(dest), replace, follow);
  }
  
  public void delete(String path, boolean deep) throws Exception
  {
    object.delete(restrictPath(path), deep);
  }
  
  // objects
  public void file(String path) throws Exception
  {
    object.file(restrictPath(path));
  }
  
  public StreamSeekable stream(String path) throws Exception
  {
    return object.stream(restrictPath(path));
  }
  
  public void node(String path) throws Exception
  {
    object.node(restrictPath(path));
  }
  
  public void nodes(String path) throws Exception
  {
    object.nodes(restrictPath(path));
  }
  
  public StreamInput list(String path) throws Exception
  {
    return object.list(restrictPath(path));
  }
  
  public StreamInput find(String path, Map options) throws Exception
  {
    return object.find(restrictPath(path), options);
  }
  
  public void link(String path, String dest) throws Exception
  {
    object.link(restrictPath(path), restrictPath(dest));
  }
  
  public void symlink(String path, String dest) throws Exception
  {
    object.symlink(restrictPath(path), restrictPath(dest));
  }
  
  public String symlink(String path) throws Exception
  {
    return object.symlink(restrictPath(path));
  }
}
