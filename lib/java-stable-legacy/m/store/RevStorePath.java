package m.store;

import m.conf.*;
import m.object.*;
import m.stream.*;
import m.enc.*;
import m.util.*;

// wraps over a regular store-path to expose directly and an internal one (or better a store file) to keep reverse links
public class RevStorePath extends WrapperStorePath
{
  protected StoreFile storeFile;
  
  public void configure(Obj conf) throws Exception
  {
    super.configure(conf);
    
    storeFile = m.Global.objects.get(StoreFile.class, conf.get(Conf.STORE));
  }
  
  public void hardLink(String path, String dest) throws Exception
  {
    // todo save reverse reference
    get().hardLink(path, dest);
  }
  
  public void link(String path, String dest) throws Exception
  {
    // todo save reverse reference
    get().link(path, dest);
  }
  
  public StreamInput linked(String path) throws Exception
  {
    throw new Exception();
  }
}
