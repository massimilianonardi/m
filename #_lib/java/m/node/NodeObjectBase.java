package m.node;

import m.object.*;
import m.stream.*;

public class NodeObjectBase implements NodeObject, NodeObjectInput, NodeObjectOutput
{
  protected Object object;
  
  public String toString()
  {
//    return object == null ? null : object.toString();
    return new com.google.gson.GsonBuilder().serializeNulls().setPrettyPrinting().create().toJson(object);
  }
  
  public Object object() throws Exception
  {
    return object;
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
  
  public void set(ByteArray object) throws Exception
  {
    this.object = object;
  }
  
  public void set(StreamInput object) throws Exception
  {
    this.object = object;
  }
  
  public void set(NodeObjectInput object) throws Exception
  {
    this.object = object.object();
  }
}
