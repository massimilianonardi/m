package m.object;

import java.util.*;
import java.io.*;

import com.google.gson.*;

import m.stream.*;

public class Obj implements Streamable, ObjInput, ObjOutput
{
  protected Object object;
  
  public Obj()
  {
    this.object = "";
  }
  
  public Obj(Object object) throws Exception
  {
    if(object == null)
    {
      throw new Exception();
    }
    
    this.object = object;
  }
  
  public Obj load(String path) throws Exception
  {
    object = new Gson().fromJson(new FileReader(path), Object.class);
    
    return this;
  }
  
  public Obj save(String path) throws Exception
  {
    new GsonBuilder().setPrettyPrinting().create().toJson(object, new FileWriter(path));
    
    return this;
  }
  
  public void parse(String json) throws Exception
  {
    Gson gson = new Gson();
    object = gson.fromJson(json, Object.class);
  }
  
  public void fromBufferByte(ByteArray buffer) throws Exception
  {
    Gson gson = new Gson();
    object = gson.fromJson(new String(Arrays.copyOf(buffer.buffer(), buffer.length()), m.enc.Encoding.UTF_8), Object.class);
  }
  
  public void streamFromInput(StreamInput in) throws Exception
  {
    Gson gson = new Gson();
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    in.streamToOutput(new WrapperIOByteStreamOutput(baos));
    baos.close();
    object = gson.fromJson(new String(baos.toByteArray(), m.enc.Encoding.UTF_8), Object.class);
  }
  
  public ByteArray toBufferByte() throws Exception
  {
    Gson gson = new GsonBuilder().setPrettyPrinting().create();
    ByteArray buffer = new ByteArray();
    buffer.buffer(gson.toJson(object).getBytes(m.enc.Encoding.UTF_8));
    return buffer;
  }
  
  public void streamToOutput(StreamOutput out) throws Exception
  {
    out.write(toBufferByte());
  }
  
  public Object object() throws Exception
  {
    return object;
  }
  
  public Obj get(String key) throws Exception
  {
    Object obj = ((Map) object).get(key);
    if(obj == null)
    {
      return null;
    }
    else if(obj instanceof Obj)
    {
      return (Obj) obj;
    }
    else
    {
      return new Obj(obj);
    }
  }
  
  public Obj get(int key) throws Exception
  {
    Object obj = ((List) object).get(key);
    if(obj == null)
    {
      return null;
    }
    else if(obj instanceof Obj)
    {
      return (Obj) obj;
    }
    else
    {
      return new Obj(obj);
    }
  }
  
  public void setObject(Object object) throws Exception
  {
    this.object = object;
  }
  
  public void setObject(String key, Object object) throws Exception
  {
    map().put(key, object);
  }
  
  public void setObject(int key, Object object) throws Exception
  {
    list().set(key, object);
  }
  
  public void addObject(Object object) throws Exception
  {
    list().add(object);
  }
  
  public void merge(Obj object) throws Exception
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
