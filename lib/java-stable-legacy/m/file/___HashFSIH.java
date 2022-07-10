package m.file;

import m.object.*;
import m.stream.*;
import m.enc.*;

//public class HashFSIH extends WrapperFileSystemIndexed implements FileSystemIndexedHashed
public class ___HashFSIH extends ___WrapperFileSystem implements ___FileSystemIndexedHashed
{
  public String file() throws Exception
  {
    return "$index/" + super.file();
  }
  
  public String hashFromIndex(String index) throws Exception
  {
    return symlink("$index/" + index);
  }
  
  public String indexFromHash(String hash) throws Exception
  {
    return symlink("$hash/" + hash);
  }
  
  public StreamSeekable stream(String path) throws Exception
  {
//    return new HashStreamSeekable(super.stream(path));
//    return new OSFileHashedStream(this, path, super.stream(path));
    throw new Exception();
  }
  
  public void streamClose(StreamSeekable stream) throws Exception
  {
    throw new Exception();
  }
}
