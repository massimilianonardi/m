package m.store;

import m.conf.*;
import m.object.*;
import m.stream.*;
import m.enc.*;

public class HashStoreFileSealed extends WrapperStoreFileSealed
{
  static final public String FILE_NAME = "file";
  
  static final public int BUFFER_SIZE = ByteArray.DEFAULT;
  
  protected String hashAlg;
  protected boolean readOnly;
  
  public void configure(Obj conf) throws Exception
  {
    super.configure(conf);
    
    hashAlg = conf.string(Conf.HASH);
    if(hashAlg == null || "".equals(hashAlg))
    {
      hashAlg = Hash.DEFAULT;
    }
    
    Boolean readOnlyObject = conf.bool(Conf.SIZE);
    readOnly = readOnlyObject == null ? false : readOnlyObject.booleanValue();
  }
  
  public String hashAlgorithm() throws Exception
  {
    return hashAlg;
  }
  
  public String fileCreate(StreamInput stream) throws Exception
  {
    HashStreamInput hsi = new HashStreamInput(stream, hashAlg);
    String index = get().fileCreate(hsi);
    hsi.close();
    String hash = hsi.toHEXString();
//    get().fileIndex(index(index), index(hash));
    if(!get().fileExists(hash))
    {
      get().fileIndex(index, hash);
    }
    else
    {
      // deduplication -> hash already present
      get().fileDelete(index);
    }
    return hash;
  }
  
  public void fileDelete(String hash) throws Exception
  {
    if(readOnly == true)
    {
      throw new Exception();
    }
    
    get().fileDelete(hash);
  }
}
