package m.file;

import java.util.*;

import m.conf.*;
import m.stream.*;

public class ___WrapperFileSystemIndexed extends ConfigurableWrapper<___FileSystemIndexed> implements ___FileSystemIndexed
{
  public void delete(String index) throws Exception
  {
    object.delete(index);
  }
  
  public String file() throws Exception
  {
    return object.file();
  }
  
  public void file(String index) throws Exception
  {
    object.file(index);
  }
  
  public StreamSeekable stream(String index) throws Exception
  {
    return object.stream(index);
  }
  
  public StreamInput list(String index) throws Exception
  {
    return object.list(index);
  }
  
  public StreamInput find(String index, Map options) throws Exception
  {
    return object.find(index, options);
  }
}
