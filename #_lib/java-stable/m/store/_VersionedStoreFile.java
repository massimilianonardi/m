package m.store;

import m.conf.*;
import m.object.*;
import m.stream.*;
import m.enc.*;
import m.util.*;

public class _VersionedStoreFile extends WrapperStoreFile
{
  public String commit(String index) throws Exception
  {
    // todo if changed then save another version and keep track of file versions branch (modifications, merge, splits)
    return get().fileCopy(index);
  }
  
  public String merge(StreamInput stream, String ... index) throws Exception
  {
    // record new stream and create branch merge among specified indexes
    return get().fileCreate(stream);
  }
  
  public void split(String index, String ... indexes) throws Exception
  {
    // todo copy (copy on write may be supported by sub-store, not implemented here) to new indexes and split branch
//    return get().fileCopy(index(index));
  }
  
//  public StreamSeekable fileStream(String index) throws Exception
//  {
//    // todo if auto-commit and if changed then save another version and keep track of file versions branch (modifications, merge, splits)
//    return get().fileStream(index(index));
//  }
}
