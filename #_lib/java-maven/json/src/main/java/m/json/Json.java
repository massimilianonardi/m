package m.json;

import java.util.*;
import java.io.*;

import com.google.gson.*;

public class Json implements ObjInput, ObjOutput
{
  protected Object object;
  
  public Json()
  {
    this.object = "";
  }
  
  public Json(Object object) throws Exception
  {
    if(object == null)
    {
      throw new Exception();
    }
    
    this.object = object;
  }
  
  public Json load(String path) throws Exception
  {
    object = new GsonBuilder().serializeNulls().create().fromJson(new FileReader(path), Object.class);
    
    return this;
  }
  
  public Json save(String path) throws Exception
  {
    new GsonBuilder().serializeNulls().setPrettyPrinting().create().toJson(object, new FileWriter(path));
    
    return this;
  }
  
  public Json parse(String json) throws Exception
  {
    Gson gson = new GsonBuilder().serializeNulls().create();
    object = gson.fromJson(json, Object.class);
    
    return this;
  }
  
  public String toJson() throws Exception
  {
    Gson gson = new GsonBuilder().serializeNulls().setPrettyPrinting().create();
    return gson.toJson(object);
  }
  
  public Object object() throws Exception
  {
    return object;
  }
  
  public Json get(String key) throws Exception
  {
    Object obj = ((Map) object).get(key);
    if(obj == null)
    {
      return null;
    }
    else if(obj instanceof Json)
    {
      return (Json) obj;
    }
    else
    {
      return new Json(obj);
    }
  }
  
  public Json get(int key) throws Exception
  {
    Object obj = ((List) object).get(key);
    if(obj == null)
    {
      return null;
    }
    else if(obj instanceof Json)
    {
      return (Json) obj;
    }
    else
    {
      return new Json(obj);
    }
  }
  
  public void setObject(Object object) throws Exception
  {
    this.object = object;
  }
  
  public void setObject(String key, Object object) throws Exception
  {
    if(map() == null)
    {
      this.object = new HashMap<String, Object>();
    }
    
    map().put(key, object);
  }
  
  public void setObject(int key, Object object) throws Exception
  {
    if(list() == null)
    {
      this.object = new ArrayList<Object>();
    }
    
    list().set(key, object);
  }
  
  public void addObject(Object object) throws Exception
  {
    if(list() == null)
    {
      this.object = new ArrayList<Object>();
    }
    
    list().add(object);
  }
  
  public void merge(Json object) throws Exception
  {
    if(object == null)
    {
      return;
    }
    
    if(type(List.class) && object.type(List.class))
    {
      list().addAll(object.list());
    }
    else if(type(Map.class) && object.type(Map.class))
    {
      map().putAll(object.map());
    }
    else
    {
      setObject(object.object());
    }
  }
}
