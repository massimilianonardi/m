package m.file;

import java.io.*;
import java.nio.file.*;
import java.util.*;

import m.conf.*;
import m.object.*;

public class CHRootFileSystem extends WrapperFileSystem
{
  protected Path rootPath;
  protected String separator;
  
  public void configure(Obj conf) throws Exception
  {
    super.configure(conf);
    
    String root = conf.string(Conf.ROOT);
    
    if(root == null)
    {
      return;
    }
    
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
  
  public String root() throws Exception
  {
    return rootPath.toString();
  }
  
  protected String path(String path) throws Exception
  {
    if(path == null)
    {
      return root();
    }
    
    Path p;
    Path rootPath = Paths.get(root()).normalize();
    String separator = FileSystems.getDefault().getSeparator();
    if(separator == null)
    {
      p = rootPath.resolve(path).normalize();
    }
    else
    {
      p = rootPath.resolve(path.replace("/", separator)).normalize();
    }
    
    m.Global.log.debug(root(), path, p.toString());
    
    if(!p.startsWith(rootPath))
    {
      throw new Exception();
    }
    
    return p.toString();
  }
  
  public ObjInput find(String path, Map options) throws Exception
  {
    m.Global.log.debug(path(path).toString(), Paths.get(path(path)).toAbsolutePath().toString());
    
    File dir = new File(path(path).toString());
    if(!(dir.exists() && dir.isDirectory()))
    {
      throw new Exception();
    }
//    String[] dirListing = dir.list();
//    return new Obj(dirListing == null ? new ArrayList<String>() : new ArrayList<String>(Arrays.asList(dirListing)));
    
    PathMatcher pathMatcher = FileSystems.getDefault().getPathMatcher("regex:" + options.get("regex"));
    Iterator<Path> iterator = Files.walk(Paths.get(path(path)), FileVisitOption.FOLLOW_LINKS).filter(pathMatcher::matches).iterator();
    List<String> list = new ArrayList<String>();
    while(iterator.hasNext())
    {
      list.add(iterator.next().toString().replace(root() + FileSystems.getDefault().getSeparator(), ""));
    }
    
    return new Obj(list);
  }
}
