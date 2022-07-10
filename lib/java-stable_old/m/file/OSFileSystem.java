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

public class OSFileSystem implements FileSystem, ConfigurableObject
{
  protected Path rootPath;
  protected String separator;
  
  public void configure(Obj conf) throws Exception
  {
    String root = conf.string(Conf.ROOT);
    
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
    
    rootPath = rootPath.normalize().toAbsolutePath().normalize();
    
    separator = FileSystems.getDefault().getSeparator();
    if("/".equals(separator))
    {
      separator = null;
    }
  }
  
  protected Path path(String path) throws Exception
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
  
  public String root() throws Exception
  {
    return rootPath.toString();
  }
  
  public String parent(String path) throws Exception
  {
    return rootPath.relativize(path(path).getParent()).toString();
  }
  
  public String relativize(String path, String dest) throws Exception
  {
    return path(path).relativize(path(dest)).toString();
  }
  
  public Attributes attributes(String path) throws Exception
  {
    return (Attributes) Files.readAttributes(path(path), BasicFileAttributes.class);
  }
  
  public void attributes(String path, Attributes attributes) throws Exception
  {
    throw new Exception();
  }
  
  public boolean exists(String path) throws Exception
  {
    return Files.exists(path(path)) || Files.isSymbolicLink(path(path));
  }
  
  public boolean isFile(String path) throws Exception
  {
    return Files.isRegularFile(path(path));
  }
  
  public boolean isNode(String path) throws Exception
  {
    return Files.isDirectory(path(path));
  }
  
  public boolean isLink(String path) throws Exception
  {
    return Files.isSymbolicLink(path(path));
  }
  
  // copy and move must follow same specs of equivalent m-scrpts (smart replace, etc.)
  public void copy(String path, String dest, boolean replace, boolean follow) throws Exception
  {
    if(follow == true)
    {
      // replace path and dest with resolved ones
    }
    
    if(replace == false)
    {
      Files.copy(path(path), path(dest));
    }
    else
    {
      Files.copy(path(path), path(dest), StandardCopyOption.REPLACE_EXISTING);
    }
  }
  
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
  
  public void file(String path) throws Exception
  {
    Files.createDirectories(path(path).getParent());
    Files.createFile(path(path));
  }
  
  public StreamSeekable stream(String path) throws Exception
  {
    return new OSFileSystemFileStream(path(path).toString(), true);
  }
  
  public StreamSeekableInput read(String path) throws Exception
  {
    // todo
    return new OSFileSystemFileStream(path(path).toString(), false);
  }
  
  public void node(String path) throws Exception
  {
    Files.createDirectory(path(path));
  }
  
  public void nodes(String path) throws Exception
  {
    Files.createDirectories(path(path));
  }
  
  public void hardLink(String path, String dest) throws Exception
  {
    Files.createLink(path(path), path(dest));
  }
  
  public void link(String path, String dest) throws Exception
  {
//    Files.createSymbolicLink(path(path), path(dest));
    Path d = path(dest);
    if(d.startsWith(rootPath))
    {
      Files.createSymbolicLink(path(path), rootPath.relativize(d));
    }
    else
    {
      Files.createSymbolicLink(path(path), d);
    }
  }
  
  public String link(String path) throws Exception
  {
    return Files.readSymbolicLink(path(path)).toString();
  }
  
  public ObjInput list(String path) throws Exception
  {
    m.Global.log.debug(path(path).toString(), path(path).toAbsolutePath().toString());
    
    File dir = new File(path(path).toString());
    if(!(dir.exists() && dir.isDirectory()))
    {
      throw new Exception();
    }
    String[] dirListing = dir.list();
    return new Obj(dirListing == null ? new ArrayList<String>() : new ArrayList<String>(Arrays.asList(dirListing)));
  }
  
  public ObjInput find(String path, Map options) throws Exception
  {
    m.Global.log.debug(path(path).toString(), path(path).toAbsolutePath().toString());
    
    File dir = new File(path(path).toString());
    if(!(dir.exists() && dir.isDirectory()))
    {
      throw new Exception();
    }
//    String[] dirListing = dir.list();
//    return new Obj(dirListing == null ? new ArrayList<String>() : new ArrayList<String>(Arrays.asList(dirListing)));
    
    PathMatcher pathMatcher = FileSystems.getDefault().getPathMatcher("regex:" + options.get("regex"));
    Iterator<Path> iterator = Files.walk(path(path), FileVisitOption.FOLLOW_LINKS).filter(pathMatcher::matches).iterator();
    List<String> list = new ArrayList<String>();
    while(iterator.hasNext())
    {
      list.add(iterator.next().toString().replace(root() + FileSystems.getDefault().getSeparator(), ""));
    }
    
    return new Obj(list);
  }
}
