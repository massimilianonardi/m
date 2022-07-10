package m.object;

import java.util.*;

import m.stream.*;

public interface ObjOutput
{
//  // should be protected or with class arg to allow correct class cast exception
//  default public void setObject(Object object) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void setObject(String key, Object object) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void setObject(int key, Object object) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void addObject(Object object) throws Exception
//  {
//    throw new Exception();
//  }
  
  // should be protected or with class arg to allow correct class cast exception
  public void setObject(Object object) throws Exception;
  public void setObject(String key, Object object) throws Exception;
  public void setObject(int key, Object object) throws Exception;
  public void addObject(Object object) throws Exception;
  
  
  
  // real interface
  
  // object
  default public void set(String object) throws Exception
  {
    setObject(object);
  }
  
  default public void set(Boolean object) throws Exception
  {
    setObject(object);
  }
  
  default public void set(Long object) throws Exception
  {
    setObject(object);
  }
  
  default public void set(Double object) throws Exception
  {
    setObject(object);
  }
  
  default public void set(Map object) throws Exception
  {
    setObject(object);
  }
  
  default public void set(List object) throws Exception
  {
    setObject(object);
  }
  
  default public void set(ByteArray object) throws Exception
  {
    setObject(object);
  }
  
  default public void set(StreamInput object) throws Exception
  {
    setObject(object);
  }
  
//  default public void set(Obj object) throws Exception
//  {
//    setObject(object);
//  }
  
  // map
  default public void set(String key, String object) throws Exception
  {
    setObject(key, object);
  }
  
  default public void set(String key, Boolean object) throws Exception
  {
    setObject(key, object);
  }
  
  default public void set(String key, Long object) throws Exception
  {
    setObject(key, object);
  }
  
  default public void set(String key, Double object) throws Exception
  {
    setObject(key, object);
  }
  
  default public void set(String key, Map object) throws Exception
  {
    setObject(key, object);
  }
  
  default public void set(String key, List object) throws Exception
  {
    setObject(key, object);
  }
  
  default public void set(String key, ByteArray object) throws Exception
  {
    setObject(key, object);
  }
  
  default public void set(String key, StreamInput object) throws Exception
  {
    setObject(key, object);
  }
  
  default public void set(String key, ObjInput object) throws Exception
  {
    setObject(key, object);
  }
  
  // list
  default public void set(int key, String object) throws Exception
  {
    setObject(key, object);
  }
  
  default public void set(int key, Boolean object) throws Exception
  {
    setObject(key, object);
  }
  
  default public void set(int key, Long object) throws Exception
  {
    setObject(key, object);
  }
  
  default public void set(int key, Double object) throws Exception
  {
    setObject(key, object);
  }
  
  default public void set(int key, Map object) throws Exception
  {
    setObject(key, object);
  }
  
  default public void set(int key, List object) throws Exception
  {
    setObject(key, object);
  }
  
  default public void set(int key, ByteArray object) throws Exception
  {
    setObject(key, object);
  }
  
  default public void set(int key, StreamInput object) throws Exception
  {
    setObject(key, object);
  }
  
  default public void set(int key, ObjInput object) throws Exception
  {
    setObject(key, object);
  }
  
  default public void add(String object) throws Exception
  {
    addObject(object);
  }
  
  default public void add(Boolean object) throws Exception
  {
    addObject(object);
  }
  
  default public void add(Long object) throws Exception
  {
    addObject(object);
  }
  
  default public void add(Double object) throws Exception
  {
    addObject(object);
  }
  
  default public void add(Map object) throws Exception
  {
    addObject(object);
  }
  
  default public void add(List object) throws Exception
  {
    addObject(object);
  }
  
  default public void add(ByteArray object) throws Exception
  {
    addObject(object);
  }
  
  default public void add(StreamInput object) throws Exception
  {
    addObject(object);
  }
  
  default public void add(ObjInput object) throws Exception
  {
    addObject(object);
  }
}
