package m.node;

public interface NodeObjectType
{
  default public String type() throws Exception
  {
    return null;
  }
  
  default public boolean isObject() throws Exception
  {
    return false;
  }
  
  default public boolean isString() throws Exception
  {
    return false;
  }
  
  default public boolean isBool() throws Exception
  {
    return false;
  }
  
  default public boolean isInteger() throws Exception
  {
    return false;
  }
  
  default public boolean isDecimal() throws Exception
  {
    return false;
  }
  
  default public boolean isBytes() throws Exception
  {
    return false;
  }
  
  default public boolean isStream() throws Exception
  {
    return false;
  }
}
