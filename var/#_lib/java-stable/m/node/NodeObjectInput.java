package m.node;

import m.object.*;
import m.stream.*;

public interface NodeObjectInput extends NodeObjectType
{
  public Object object() throws Exception;
  
//  public String string() throws Exception;
//  public Boolean bool() throws Exception;
//  public Long integer() throws Exception;
//  public Double decimal() throws Exception;
//  public ByteArray bytes() throws Exception;
//  public StreamInput stream() throws Exception;
  
  default public String string() throws Exception
  {
    return (String) object();
  }
  
  default public Boolean bool() throws Exception
  {
    return (Boolean) object();
  }
  
  default public Long integer() throws Exception
  {
    return (Long) object();
  }
  
  default public Double decimal() throws Exception
  {
    return (Double) object();
  }
  
  default public ByteArray bytes() throws Exception
  {
    return (ByteArray) object();
  }
  
  default public StreamSeekableInput stream() throws Exception
  {
    return (StreamSeekableInput) object();
  }
}
