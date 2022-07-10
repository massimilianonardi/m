package m.store;

import java.util.*;

import m.conf.*;
import m.stream.*;

public class WrapperStorePath extends ConfigurableWrapper<StorePath> implements StorePath
{
  public String root() throws Exception
  {
    return get().root();
  }
  
  public String parent(String path) throws Exception
  {
    return get().parent(path);
  }
  
  public String relativize(String path, String dest) throws Exception
  {
    return get().relativize(path, dest);
  }
  
  public Attributes attributes(String path) throws Exception
  {
    return get().attributes(path);
  }
  
  public void attributes(String path, Attributes attributes) throws Exception
  {
    get().attributes(path, attributes);
  }
  
  public boolean exists(String path) throws Exception
  {
    return get().exists(path);
  }
  
  public boolean isFile(String path) throws Exception
  {
    return get().isFile(path);
  }
  
  public boolean isNode(String path) throws Exception
  {
    return get().isNode(path);
  }
  
  public boolean isLink(String path) throws Exception
  {
    return get().isLink(path);
  }
  
  public void copy(String path, String dest, boolean replace, boolean follow) throws Exception
  {
    get().copy(path, dest, replace, follow);
  }
  
  public void move(String path, String dest, boolean replace) throws Exception
  {
    get().move(path, dest, replace);
  }
  
  public void rename(String path, String name) throws Exception
  {
    get().rename(path, name);
  }
  
  public void delete(String path, boolean deep) throws Exception
  {
    get().delete(path, deep);
  }
  
  public void file(String path) throws Exception
  {
    get().file(path);
  }
  
  public StreamSeekable stream(String path) throws Exception
  {
    return get().stream(path);
  }
  
  public StreamSeekableInput read(String path) throws Exception
  {
    return get().read(path);
  }
  
  public void node(String path) throws Exception
  {
    get().node(path);
  }
  
  public void nodes(String path) throws Exception
  {
    get().nodes(path);
  }
  
  public void hardLink(String path, String dest) throws Exception
  {
    get().hardLink(path, dest);
  }
  
  public void link(String path, String dest) throws Exception
  {
    get().link(path, dest);
  }
  
  public String link(String path) throws Exception
  {
    return get().link(path);
  }
  
  public StreamInput list(String path) throws Exception
  {
    return get().list(path);
  }
  
  public StreamInput find(String path, Map options) throws Exception
  {
    return get().find(path, options);
  }
}
