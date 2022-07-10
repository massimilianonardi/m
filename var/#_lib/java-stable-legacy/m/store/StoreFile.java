package m.store;

import m.stream.*;

public interface StoreFile extends StoreFileSealed
{
  public boolean fileExists(String index) throws Exception;
  
  public String fileCreate() throws Exception;
  default public String fileCreate(StreamInput stream) throws Exception {String index = fileCreate(); fileStream(index).streamFromInput(stream); return index;}
  public void fileCreate(String index) throws Exception;
  public void fileIndex(String index, String newIndex) throws Exception;
  public String fileCopy(String index) throws Exception;
  public void fileDelete(String index) throws Exception;
  
  default public StreamInput fileSealedStream(String index) throws Exception {return fileStream(index);}
  default public StreamSeekableInput fileReadOnlyStream(String index) throws Exception {return fileStream(index);}
  public StreamSeekable fileStream(String index) throws Exception;
  
  public StreamInput fileIndexList() throws Exception;
}
