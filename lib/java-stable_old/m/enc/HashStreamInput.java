package m.enc;

import m.object.*;
import m.stream.*;

public class HashStreamInput extends WrapperStreamInput
{
  protected HasherStreamOutput hasher;
  
  public HashStreamInput(StreamInput in) throws Exception
  {
    this(in, Hash.DEFAULT);
  }
  
  public HashStreamInput(StreamInput in, String algorithm) throws Exception
  {
    super(in);
    
    hasher = new HasherStreamOutput(algorithm);
  }
  
  public ByteArray readBytes() throws Exception
  {
    ByteArray buffer = is.readBytes();
//    hasher.write(buffer);
    if(0 < buffer.length())
    {
      hasher.write(buffer);
    }
    
    return buffer;
  }
  
  public void close() throws Exception
  {
    hasher.close();
    is.close();
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
