package m.store;

import m.conf.*;
import m.object.*;
import m.stream.*;

public class IndexSplitStoreFile extends ReindexStoreFile
{
  static final public String FILE_NAME = "file";
  static final public String SEPARATOR = "/";
  static final public int BUFFER_SIZE = ByteArray.DEFAULT;
  
  protected int splitLevel;
  protected int splitSize;
  
  public void configure(Obj conf) throws Exception
  {
    super.configure(conf);
    
    Long splitLevelObject = conf.integer(Conf.LEVEL);
    splitLevel = splitLevelObject == null ? 4 : splitLevelObject.intValue();
    
    Long splitSizeObject = conf.integer(Conf.SIZE);
//    splitSize = splitSizeObject == null ? 2 : splitSizeObject.intValue();
    splitSize = splitSizeObject == null ? 0 : splitSizeObject.intValue();
  }
  
  public String index(String index) throws Exception
  {
    if(index.length() <= splitLevel)
    {
      return index;
    }
    
    int step = splitSize;
    if(splitSize < 1)
    {
      step = index.length() / splitLevel;
    }
    String pathString = index.substring(0, step);
    for(int i = 1; i < splitLevel - 1; i++)
    {
      pathString += SEPARATOR + index.substring(step * i, step * (i + 1));
    }
    pathString += SEPARATOR + index.substring(step * (splitLevel - 1), index.length());
    
    return pathString;
  }
  
  public String rindex(String index) throws Exception
  {
    // todo proper reverse mapping based on conf because there may be separators in original index and thus incorrect reverse
    return index.replaceAll("/", "");
  }
}
