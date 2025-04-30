package m.file;

import java.nio.file.attribute.*;
import java.util.*;

import m.object.*;
import m.stream.*;

public interface FileSystem
{
  public interface Attributes extends BasicFileAttributes
  {
  }
  
  public String root() throws Exception;
  public String parent(String path) throws Exception;
  public String relativize(String path, String dest) throws Exception;
  
  public Attributes attributes(String path) throws Exception;
  public void attributes(String path, Attributes attributes) throws Exception;
  
  public boolean exists(String path) throws Exception;
  
  public boolean isFile(String path) throws Exception;
  public boolean isNode(String path) throws Exception;
  public boolean isLink(String path) throws Exception;
  
  public void copy(String path, String dest, boolean replace, boolean follow) throws Exception;
  default public void copy(String path, String dest) throws Exception {copy(path, dest, false, false);}
  public void move(String path, String dest, boolean replace) throws Exception;
  default public void move(String path, String dest) throws Exception {move(path, dest, false);}
  public void rename(String path, String name) throws Exception;
  public void delete(String path, boolean deep) throws Exception;
  default public void delete(String path) throws Exception {delete(path, false);}
  
  public void file(String path) throws Exception;
  public StreamSeekable stream(String path) throws Exception;
  default public StreamSeekableInput read(String path) throws Exception {return stream(path);}
  public void node(String path) throws Exception;
  public void nodes(String path) throws Exception;
  default public void hardLink(String path, String dest) throws Exception {link(path, dest);}
  public void link(String path, String dest) throws Exception;
  public String link(String path) throws Exception;
  
  public ObjInput list(String path) throws Exception;
  public ObjInput find(String path, Map options) throws Exception;
}
