package m.collection;

import java.util.*;

public class PrefixSet extends TreeSet<String>
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
  
  public PrefixSet()
  {
    super(new KeyComparator());
  }
  
  public String prefix(String key) throws Exception
  {
    String prefixKey = floor(key);
    
    if(key == null)
    {
      return prefixKey;
    }
    
    while(prefixKey != null && !key.startsWith(prefixKey))
    {
      prefixKey = lower(prefixKey);
    }
    
    return prefixKey;
  }
  
  public String unemptyPrefix(String key) throws Exception
  {
    String prefixKey = prefix(key);
    
    if(prefixKey != null && 0 == prefixKey.length() && 0 < key.length())
    {
      return null;
    }
    
    return prefixKey;
  }
}
