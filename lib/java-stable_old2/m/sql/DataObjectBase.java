package m.sql;

import java.util.*;

public class DataObjectBase implements DataObject
{
  protected Object object;
  
//  protected DataObjectBase() throws Exception
  public DataObjectBase()
  {
    this.object = new HashMap<String, Object>();
  }
  
  public DataObjectBase(Object object) throws Exception
  {
//    if(object == null)
//    {
//      throw new Exception();
//    }
    
    this.object = object;
  }
  
  public String type() throws Exception
  {
    return object.getClass().getName();
  }
  
  public String string() throws Exception
  {
    return (String) object;
  }
  
  public Boolean bool() throws Exception
  {
    return (Boolean) object;
  }
  
  public Long integer() throws Exception
  {
    return (Long) object;
  }
  
  public Double decimal() throws Exception
  {
    return (Double) object;
  }
  
  public Map map() throws Exception
  {
    return (Map) object;
  }
  
  public List list() throws Exception
  {
    return (List) object;
  }
  
//  public InputStream stream() throws Exception
//  {
//    return (InputStream) object;
//  }
  
  public Object object() throws Exception
  {
    return object;
  }
  
  public String string(String key) throws Exception
  {
    return (String) ((Map) object).get(key);
  }
  
  public Boolean bool(String key) throws Exception
  {
    return (Boolean) ((Map) object).get(key);
  }
  
  public Long integer(String key) throws Exception
  {
    return (Long) ((Map) object).get(key);
  }
  
  public Double decimal(String key) throws Exception
  {
    return (Double) ((Map) object).get(key);
  }
  
  public Map map(String key) throws Exception
  {
    return (Map) ((Map) object).get(key);
  }
  
  public List list(String key) throws Exception
  {
    return (List) ((Map) object).get(key);
  }
  
//  public InputStream stream(String key) throws Exception
//  {
//    return (InputStream) ((Map) object).get(key);
//  }
  
  public Object object(String key) throws Exception
  {
    return ((Map) object).get(key);
  }
  
  public DataObject get(String key) throws Exception
  {
    return new DataObjectBase(((Map) object).get(key));
  }
  
  public String string(int key) throws Exception
  {
    return (String) ((List) object).get(key);
  }
  
  public Boolean bool(int key) throws Exception
  {
    return (Boolean) ((List) object).get(key);
  }
  
  public Long integer(int key) throws Exception
  {
    return (Long) ((List) object).get(key);
  }
  
  public Double decimal(int key) throws Exception
  {
    return (Double) ((List) object).get(key);
  }
  
  public Map map(int key) throws Exception
  {
    return (Map) ((List) object).get(key);
  }
  
  public List list(int key) throws Exception
  {
    return (List) ((List) object).get(key);
  }
  
//  public InputStream stream(int key) throws Exception
//  {
//    return (InputStream) ((List) object).get(key);
//  }
  
  public Object object(int key) throws Exception
  {
    return ((List) object).get(key);
  }
  
  public DataObject get(int key) throws Exception
  {
    return new DataObjectBase(((List) object).get(key));
  }
  
  public void set(String object) throws Exception
  {
    this.object = object;
  }
  
  public void set(Boolean object) throws Exception
  {
    this.object = object;
  }
  
  public void set(Long object) throws Exception
  {
    this.object = object;
  }
  
  public void set(Double object) throws Exception
  {
    this.object = object;
  }
  
  public void set(Map object) throws Exception
  {
    this.object = object;
  }
  
  public void set(List object) throws Exception
  {
    this.object = object;
  }
  
//  public void set(InputStream object) throws Exception
//  {
//    this.object = object;
//  }
  
  public void set(DataObjectInput object) throws Exception
  {
    this.object = object.object();
  }
  
  public void set(String key, String object) throws Exception
  {
    ((Map) this.object).put(key, object);
  }
  
  public void set(String key, Boolean object) throws Exception
  {
    ((Map) this.object).put(key, object);
  }
  
  public void set(String key, Long object) throws Exception
  {
    ((Map) this.object).put(key, object);
  }
  
  public void set(String key, Double object) throws Exception
  {
    ((Map) this.object).put(key, object);
  }
  
  public void set(String key, Map object) throws Exception
  {
    ((Map) this.object).put(key, object);
  }
  
  public void set(String key, List object) throws Exception
  {
    ((Map) this.object).put(key, object);
  }
  
//  public void set(String key, InputStream object) throws Exception
//  {
//    ((Map) this.object).put(key, object);
//  }
  
  public void set(String key, DataObjectInput object) throws Exception
  {
    ((Map) this.object).put(key, object.object());
  }
  
  public void set(int key, String object) throws Exception
  {
    ((List) this.object).add(key, object);
  }
  
  public void set(int key, Boolean object) throws Exception
  {
    ((List) this.object).add(key, object);
  }
  
  public void set(int key, Long object) throws Exception
  {
    ((List) this.object).add(key, object);
  }
  
  public void set(int key, Double object) throws Exception
  {
    ((List) this.object).add(key, object);
  }
  
  public void set(int key, Map object) throws Exception
  {
    ((List) this.object).add(key, object);
  }
  
  public void set(int key, List object) throws Exception
  {
    ((List) this.object).add(key, object);
  }
  
//  public void set(int key, InputStream object) throws Exception
//  {
//    ((List) this.object).add(key, object);
//  }
  
  public void set(int key, DataObjectInput object) throws Exception
  {
    ((List) this.object).add(key, object.object());
  }
  
  public void add(String value) throws Exception
  {
    ((List) this.object).add(object);
  }
  
  public void add(Boolean object) throws Exception
  {
    ((List) this.object).add(object);
  }
  
  public void add(Long value) throws Exception
  {
    ((List) this.object).add(object);
  }
  
  public void add(Double value) throws Exception
  {
    ((List) this.object).add(object);
  }
  
  public void add(Map value) throws Exception
  {
    ((List) this.object).add(object);
  }
  
  public void add(List value) throws Exception
  {
    ((List) this.object).add(object);
  }
  
//  public void add(InputStream value) throws Exception
//  {
//    ((List) this.object).add(object);
//  }
  
  public void add(DataObjectInput object) throws Exception
  {
    ((List) this.object).add(object.object());
  }
}

//public class DataObjectBase implements DataObject
//{
//  protected Object object;
//  
//  protected DataObjectBase() throws Exception
//  {
//  }
//  
//  public DataObjectBase(Object object) throws Exception
//  {
//    this.object = object;
//  }
//  
//  public DataObject object(String key) throws Exception
//  {
//    return new DataObjectBase(((Map) object).get(key));
//  }
//  
//  public DataObject object(int key) throws Exception
//  {
//    return new DataObjectBase(((List) object).get(key));
//  }
//  
//  public Map map() throws Exception
//  {
//    return (Map) object;
//  }
//  
//  public List list() throws Exception
//  {
//    return (List) object;
//  }
//  
//  public String string(String key) throws Exception
//  {
//    return (String) ((Map) object).get(key);
//  }
//  
//  public long integer(String key) throws Exception
//  {
//    return (Long) ((Map) object).get(key);
//  }
//  
//  public double decimal(String key) throws Exception
//  {
//    return (Double) ((Map) object).get(key);
//  }
//  
//  public String string(int key) throws Exception
//  {
//    return (String) ((List) object).get(key);
//  }
//  
//  public long integer(int key) throws Exception
//  {
//    return (Long) ((List) object).get(key);
//  }
//  
//  public double decimal(int key) throws Exception
//  {
//    return (Double) ((List) object).get(key);
//  }
//  
//  public void set(String key, String value) throws Exception
//  {
//    ((Map) object).put(key, value);
//  }
//  
//  public void set(String key, long value) throws Exception
//  {
//    ((Map) object).put(key, value);
//  }
//  
//  public void set(String key, double value) throws Exception
//  {
//    ((Map) object).put(key, value);
//  }
//  
//  public void set(String key, DataObject value) throws Exception
//  {
//    ((Map) object).put(key, value);
//  }
//  
//  public void set(int key, String value) throws Exception
//  {
//    ((List) object).add(key, value);
//  }
//  
//  public void set(int key, long value) throws Exception
//  {
//    ((List) object).add(key, value);
//  }
//  
//  public void set(int key, double value) throws Exception
//  {
//    ((List) object).add(key, value);
//  }
//  
//  public void set(int key, DataObject value) throws Exception
//  {
//    ((List) object).add(key, value);
//  }
//  
//  public void add(String value) throws Exception
//  {
//    ((List) object).add(value);
//  }
//  
//  public void add(long value) throws Exception
//  {
//    ((List) object).add(value);
//  }
//  
//  public void add(double value) throws Exception
//  {
//    ((List) object).add(value);
//  }
//  
//  public void add(DataObject value) throws Exception
//  {
//    ((List) object).add(value);
//  }
//}
