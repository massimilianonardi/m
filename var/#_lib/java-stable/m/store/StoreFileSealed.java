package m.store;

import m.object.*;
import m.node.*;
import m.stream.*;

public interface StoreFileSealed
{
  public boolean fileExists(String index) throws Exception;
  
  public String fileCreate(StreamInput stream) throws Exception;
//  public void fileDelete(String index) throws Exception;
  
  public StreamInput fileSealedStream(String index) throws Exception;
  public StreamSeekableInput fileReadOnlyStream(String index) throws Exception;
  
  public ObjInput fileIndexList() throws Exception;
}
