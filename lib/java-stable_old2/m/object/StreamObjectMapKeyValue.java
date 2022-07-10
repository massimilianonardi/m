package m.object;

import java.util.*;

import m.stream.*;

public class StreamObjectMapKeyValue implements StreamObjectInput<String>
{
  protected Map map;
  protected String separator;
  protected Iterator<Map.Entry> iterator;
  
  public StreamObjectMapKeyValue(Map map, String separator) throws Exception
  {
    this.map = map;
    this.separator = separator;
    this.iterator = map.entrySet().iterator();
  }
  
  public boolean eos() throws Exception
  {
    return !iterator.hasNext();
  }
  
  public String readObject() throws Exception
  {
    Map.Entry object = iterator.next();
    
    return object.getKey() + separator + object.getValue();
  }
}
