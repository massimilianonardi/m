package m.collection;

import java.util.*;

public class PrefixMap<T> extends TreeMap<String, T>
{
  static protected class KeyComparator implements Comparator<String>
  {
    public int compare(String s1, String s2)
    {
      if(s1 == null)
      {
        if(s2 == null)
        {
          return 0;
        }
        else
        {
          return -1;
        }
      }
      else if(s2 == null)
      {
        return 1;
      }
      else
      {
        return s1.compareTo(s2);
      }
    }
  };
  
  public PrefixMap()
  {
    super(new KeyComparator());
  }
  
  public String prefixKey(String key) throws Exception
  {
    String prefixKey = floorKey(key);
    
    if(key == null)
    {
      return prefixKey;
    }
    
    while(prefixKey != null && !key.startsWith(prefixKey))
    {
      prefixKey = lowerKey(prefixKey);
    }
    
    return prefixKey;
  }
  
  public T prefix(String key) throws Exception
  {
    return get(prefixKey(key));
  }
  
  public Map.Entry<String, T> prefixEntry(String key) throws Exception
  {
    return floorEntry(prefixKey(key));
  }
  
  public String unemptyPrefixKey(String key) throws Exception
  {
    String prefixKey = prefixKey(key);
    
    if(prefixKey != null && 0 == prefixKey.length() && 0 < key.length())
    {
      return null;
    }
    
    return prefixKey;
  }
  
  public T unemptyPrefix(String key) throws Exception
  {
    return get(unemptyPrefixKey(key));
  }
  
  public Map.Entry<String, T> unemptyPrefixEntry(String key) throws Exception
  {
    return floorEntry(unemptyPrefixKey(key));
  }
}
