package m.file;

import m.stream.*;

public interface ___FileSystemIndexedHashed extends ___FileSystemIndexed
{
  public String hashFromIndex(String index) throws Exception;
  public String indexFromHash(String hash) throws Exception;
  
  default public StreamSeekable streamFromHash(String hash) throws Exception
  {
    return stream(indexFromHash(hash));
  }
  
  public void streamClose(StreamSeekable stream) throws Exception;
  
//  default public String hashFromIndex(String index) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public String indexFromHash(String hash) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public StreamSeekable streamFromHash(String hash) throws Exception
//  {
//    return stream(indexFromHash(hash));
//  }
//  
//  default public void streamClose(StreamSeekable stream) throws Exception
//  {
//    throw new Exception();
//  }
}
