package m.object;

import java.util.*;

import m.stream.*;

public interface ObjInput
{
  public Object object() throws Exception;
  
  default public String type() throws Exception
  {
    return object().getClass().getName();
  }
  
  default public boolean type(Class type) throws Exception
  {
    try
    {
      type.cast(object());
      return true;
    }
    catch(Exception e)
    {
      return false;
    }
  }
  
  // object
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
//    return (Long) object();
    return object() == null ? null : (Long) decimal().longValue();
  }
  
  default public Double decimal() throws Exception
  {
    return (Double) object();
  }
  
  default public Map map() throws Exception
  {
    return (Map) object();
  }
  
  default public List list() throws Exception
  {
    return (List) object();
  }
  
  default public ByteArray bytes() throws Exception
  {
    return (ByteArray) object();
  }
  
  default public StreamInput stream() throws Exception
  {
    return (StreamInput) object();
  }
  
  // map
  default public Object object(String key) throws Exception
  {
    return ((Map) object()).get(key);
  }
  
  default public String string(String key) throws Exception
  {
    return (String) object(key);
  }
  
  default public Boolean bool(String key) throws Exception
  {
    return (Boolean) object(key);
  }
  
  default public Long integer(String key) throws Exception
  {
//    return (Long) object(key);
    return object(key) == null ? null : (Long) decimal(key).longValue();
  }
  
  default public Double decimal(String key) throws Exception
  {
    return (Double) object(key);
  }
  
  default public Map map(String key) throws Exception
  {
    return (Map) object(key);
  }
  
  default public List list(String key) throws Exception
  {
    return (List) object(key);
  }
  
  default public ByteArray bytes(String key) throws Exception
  {
    return (ByteArray) object(key);
  }
  
  default public StreamInput stream(String key) throws Exception
  {
    return (StreamInput) object(key);
  }
  
  default public ObjInput get(String key) throws Exception
  {
    return (ObjInput) object(key);
  }
  
  // list
  default public Object object(int key) throws Exception
  {
    return ((List) object()).get(key);
  }
  
  default public String string(int key) throws Exception
  {
    return (String) object(key);
  }
  
  default public Boolean bool(int key) throws Exception
  {
    return (Boolean) object(key);
  }
  
  default public Long integer(int key) throws Exception
  {
//    return (Long) object(key);
    return object(key) == null ? null : (Long) decimal(key).longValue();
  }
  
  default public Double decimal(int key) throws Exception
  {
    return (Double) object(key);
  }
  
  default public Map map(int key) throws Exception
  {
    return (Map) object(key);
  }
  
  default public List list(int key) throws Exception
  {
    return (List) object(key);
  }
  
  default public ByteArray bytes(int key) throws Exception
  {
    return (ByteArray) object(key);
  }
  
  default public StreamInput stream(int key) throws Exception
  {
    return (StreamInput) object(key);
  }
  
  default public ObjInput get(int key) throws Exception
  {
    return (ObjInput) object(key);
  }
}
