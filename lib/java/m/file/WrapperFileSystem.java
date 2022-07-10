package m.file;

import java.util.*;

import m.conf.*;
import m.object.*;
import m.stream.*;

public class WrapperFileSystem extends ConfigurableWrapper<FileSystem> implements FileSystem
{
  protected String path(String path) throws Exception
  {
    return path;
  }
  
  public String root() throws Exception
  {
    return get().root();
  }
  
  public String parent(String path) throws Exception
  {
    return get().parent(path(path));
  }
  
  public String relativize(String path, String dest) throws Exception
  {
    return get().relativize(path(path), path(dest));
  }
  
  public Attributes attributes(String path) throws Exception
  {
    return get().attributes(path(path));
  }
  
  public void attributes(String path, Attributes attributes) throws Exception
  {
    get().attributes(path(path), attributes);
  }
  
  public boolean exists(String path) throws Exception
  {
    return get().exists(path(path));
  }
  
  public boolean isFile(String path) throws Exception
  {
    return get().isFile(path(path));
  }
  
  public boolean isNode(String path) throws Exception
  {
    return get().isNode(path(path));
  }
  
  public boolean isLink(String path) throws Exception
  {
    return get().isLink(path(path));
  }
  
  public void copy(String path, String dest, boolean replace, boolean follow) throws Exception
  {
    get().copy(path(path), path(dest), replace, follow);
  }
  
  public void move(String path, String dest, boolean replace) throws Exception
  {
    get().move(path(path), path(dest), replace);
  }
  
  public void rename(String path, String name) throws Exception
  {
    get().rename(path(path), path(name));
  }
  
  public void delete(String path, boolean deep) throws Exception
  {
    get().delete(path(path), deep);
  }
  
  public void file(String path) throws Exception
  {
    get().file(path(path));
  }
  
  public StreamSeekable stream(String path) throws Exception
  {
    return get().stream(path(path));
  }
  
  public StreamSeekableInput read(String path) throws Exception
  {
    return get().read(path(path));
  }
  
  public void node(String path) throws Exception
  {
    get().node(path(path));
  }
  
  public void nodes(String path) throws Exception
  {
    get().nodes(path(path));
  }
  
  public void hardLink(String path, String dest) throws Exception
  {
    get().hardLink(path(path), path(dest));
  }
  
  public void link(String path, String dest) throws Exception
  {
    get().link(path(path), path(dest));
  }
  
  public String link(String path) throws Exception
  {
    return get().link(path(path));
  }
  
  public ObjInput list(String path) throws Exception
  {
    return get().list(path(path));
  }
  
  public ObjInput find(String path, Map options) throws Exception
  {
    return get().find(path(path), options);
  }
}
