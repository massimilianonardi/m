package m.file;

import java.text.*;
import java.util.*;

import m.object.*;
import m.conf.*;

public class ___DateTimeRandomFSI extends ___WrapperFileSystem implements ___FileSystemIndexed
{
  static protected int MAX_RANDOM_SUFFIX = 1000000;
  static protected Random rnd = new Random();
  
  protected String root;
  
  public ___DateTimeRandomFSI(___FileSystem fs, String index) throws Exception
  {
    root = index;
  }
  
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
  
  protected String path() throws Exception
  {
    return new SimpleDateFormat("yyyy/MM/dd/HH/mm/ss_" + ("" + (rnd.nextInt(MAX_RANDOM_SUFFIX) + MAX_RANDOM_SUFFIX)).substring(1)).format(new Date());
  }
  
  public String file() throws Exception
  {
    String path = path();
    nodes(parent(path));
    file(path);
    return path;
  }
  
//  public String node() throws Exception
//  {
//    String path = path();
//    nodes(path);
//    return path;
//  }
}
