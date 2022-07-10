package m.file;

import java.util.*;

import m.stream.*;

public interface ___FileSystemIndexed
{
  public void delete(String index) throws Exception;
  public String file() throws Exception;
  public void file(String path) throws Exception;
  public StreamSeekable stream(String index) throws Exception;
  public StreamInput list(String index) throws Exception;
  public StreamInput find(String index, Map options) throws Exception;
  
//  default public void delete(String index) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public String file() throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void file(String path) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public StreamSeekable stream(String index) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public StreamInput list(String index) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public StreamInput find(String index, Map options) throws Exception
//  {
//    throw new Exception();
//  }
}
