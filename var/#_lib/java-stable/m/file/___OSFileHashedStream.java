package m.file;

import m.object.*;
import m.enc.*;

public class ___OSFileHashedStream extends HashStreamSeekable
{
  protected String hashAlg;
  
  public ___OSFileHashedStream(String filePath) throws Exception
  {
    this(filePath, ByteArray.DEFAULT);
  }
  
  public ___OSFileHashedStream(String filePath, int bufferSize) throws Exception
  {
    this(filePath, ByteArray.DEFAULT, Hash.DEFAULT);
  }
  
  public ___OSFileHashedStream(String filePath, int bufferSize, String hashAlgorithm) throws Exception
  {
    super(new ___OSFileStream(filePath, bufferSize), Hash.DEFAULT);
    
    hashAlg = hashAlgorithm;
  }
  
  public String hashAlgorithm() throws Exception
  {
    return hashAlg;
  }
}
