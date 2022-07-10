package m.file;

import java.io.*;
import java.nio.*;
import java.nio.file.attribute.*;
import java.nio.channels.*;
import java.nio.file.*;
import java.util.*;

import m.conf.*;
import m.object.*;
import m.stream.*;

public class ___OSFS implements ___FileSystem, ConfigurableObject
{
  protected String root;
  protected Path rootPath;
  protected String separator;
  
  public void configure(Obj conf) throws Exception
  {
    root = conf.string(Conf.ROOT);
    
    rootPath = Paths.get(root).normalize();
    
    Path pkgPath = Paths.get(this.getClass().getProtectionDomain().getCodeSource().getLocation().getPath());
    if(root == null || "".equals(root))
    {
      rootPath = pkgPath.getParent();
    }
    else if(root.startsWith("@/"))
    {
      rootPath = pkgPath.getParent().resolve(root.substring(2));
    }
    else if(root.startsWith("~/"))
    {
      rootPath = Paths.get(System.getProperty("user.home")).resolve(root.substring(2));
    }
    
//    rootPath = rootPath.normalize();
    rootPath = rootPath.normalize().toAbsolutePath().normalize();
    root = rootPath.toString();
    
    separator = FileSystems.getDefault().getSeparator();
    if("/".equals(separator))
    {
      separator = null;
    }
    
    m.Global.log.debug(root);
  }
  
  public String root() throws Exception
  {
    return root;
  }
  
  public Path path(String path) throws Exception
  {
    if(path == null)
    {
      return rootPath;
    }
    else if(separator == null)
    {
      return rootPath.resolve(path).normalize();
    }
    else
    {
      return rootPath.resolve(path.replace("/", separator)).normalize();
    }
  }
  
  public String file() throws Exception
  {
    throw new Exception();
  }
  
  // attributes
  public Attributes attributes(String path) throws Exception
  {
    return (Attributes) Files.readAttributes(path(path), BasicFileAttributes.class);
  }
  
  public void attributes(String path, Attributes attributes) throws Exception
  {
    throw new Exception();
  }

  // direct attribute queries
  public boolean exists(String path) throws Exception
  {
    return Files.exists(path(path));
  }
  
  public boolean isFile(String path) throws Exception
  {
    return Files.isRegularFile(path(path));
  }
  
  public boolean isNode(String path) throws Exception
  {
    return Files.isDirectory(path(path));
  }
  
  public boolean isSymbolicLink(String path) throws Exception
  {
    return Files.isSymbolicLink(path(path));
  }
  
  public String parent(String path) throws Exception
  {
    return path(path).getParent().toString();
  }
  
  // all object types operations
  public void move(String path, String dest, boolean replace) throws Exception
  {
    if(replace)
    {
      Files.move(path(path), path(dest), StandardCopyOption.REPLACE_EXISTING);
    }
    else
    {
      Files.move(path(path), path(dest));
    }
  }
  
  public void rename(String path, String name) throws Exception
  {
    Path dest = path(path).getParent().resolve(name);
    if(Files.exists(dest))
    {
      throw new Exception();
    }
    
    Files.move(path(path), dest);
  }
  
  public void copy(String path, String dest, boolean replace, boolean follow) throws Exception
  {
    // todo
    throw new Exception();
  }
  
  public void delete(String path, boolean deep) throws Exception
  {
    if(deep)
    {
      Files.walk(path(path)).sorted(Comparator.reverseOrder()).forEach(p -> 
      {
        try
        {
          Files.delete(p);
        }
        catch(Exception e)
        {
          e.printStackTrace();
        }
      });
    }
    else
    {
      Files.delete(path(path));
    }
  }
  
  // objects
  public void file(String path) throws Exception
  {
    nodes(parent(path));
    Files.createFile(path(path));
  }
  
  public StreamSeekable stream(String path) throws Exception
  {
//    nodes(parent(path));
    return new ___OSFSFileStream(path(path).toString());
  }
  
  public void node(String path) throws Exception
  {
    Files.createDirectory(path(path));
  }
  
  public void nodes(String path) throws Exception
  {
    Files.createDirectories(path(path));
  }
  
  public StreamInput list(String path) throws Exception
  {
    return new ___OSFSFindStream(path(path).toString());
  }
  
  public StreamInput find(String path, Map options) throws Exception
  {
    return new ___OSFSFindStream(path(path).toString(), options);
  }
  
  public void link(String path, String dest) throws Exception
  {
    Files.createLink(path(path), path(dest));
  }
  
  public void symlink(String path, String dest) throws Exception
  {
    Files.createSymbolicLink(path(path), path(dest));
  }
  
  public String symlink(String path) throws Exception
  {
    return Files.readSymbolicLink(path(path)).toString();
  }
}
