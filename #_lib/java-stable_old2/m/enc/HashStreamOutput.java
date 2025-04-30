package m.enc;

import m.object.*;
import m.stream.*;

public class HashStreamOutput extends WrapperStreamOutput
{
  protected HasherStreamOutput hasher;
  
  public HashStreamOutput(StreamOutput out) throws Exception
  {
    this(out, Hash.DEFAULT);
  }
  
  public HashStreamOutput(StreamOutput out, String algorithm) throws Exception
  {
    super(out);
    
    hasher = new HasherStreamOutput(algorithm);
  }
  
  public void write(ByteArray buffer) throws Exception
  {
    os.write(buffer);
    hasher.write(buffer);
  }
  
  public void close() throws Exception
  {
    hasher.close();
    os.close();
  }
  
  public byte[] hash() throws Exception
  {
    return hasher.hash();
  }
  
  public String toHEXString() throws Exception
  {
    return hasher.toHEXString();
  }
}
