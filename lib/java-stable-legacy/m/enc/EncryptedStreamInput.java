package m.enc;

import m.object.*;
import m.stream.*;

public class EncryptedStreamInput extends WrapperStreamInput
{
  protected HasherStreamOutput encrypter;
  
  public EncryptedStreamInput(StreamInput in) throws Exception
  {
    this(in, Hash.DEFAULT);
  }
  
  public EncryptedStreamInput(StreamInput in, String algorithm) throws Exception
  {
    super(in);
    
    encrypter = new HasherStreamOutput(algorithm);
  }
  
  public ByteArray readBytes() throws Exception
  {
    ByteArray buffer = is.readBytes();
    encrypter.write(buffer);
    return buffer;
  }
}
