package m.store;

import m.stream.*;

public interface StoreFileSealed
{
  public boolean fileExists(String index) throws Exception;
  
  public String fileCreate(StreamInput stream) throws Exception;
  public void fileDelete(String index) throws Exception;
  
  default public void fileGet(String index, StreamOutput stream) throws Exception {fileSealedStream(index).streamToOutput(stream);}
  public StreamInput fileSealedStream(String index) throws Exception;
  public StreamSeekableInput fileReadOnlyStream(String index) throws Exception;
  
  public StreamInput fileIndexList() throws Exception;
}
