package m.store;

import m.conf.*;
import m.object.*;
import m.stream.*;
import m.enc.*;
import m.util.*;

// initially a full cache for map of redundant nodes and random choice for redundant nodes
// store for part/files
// manages also part files with a proper store-file -> store-file for redundant-nodes-files + store-file for part-files + store-file for files
// no links for external resources that are provided through net-store-path
public class NetStoreFile extends WrapperStoreFile
{
  protected StoreFile storeFileRedundant;
  protected StoreFile storeFilePart;
  
  public void configure(Obj conf) throws Exception
  {
    super.configure(conf);
    
    storeFileRedundant = m.Global.objects.get(StoreFile.class, conf.get(Conf.REDUNDANT));
    storeFilePart = m.Global.objects.get(StoreFile.class, conf.get(Conf.PART));
  }
  
}
