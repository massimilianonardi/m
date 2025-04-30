package m.enc;

import m.object.*;
import m.stream.*;

public class EncryptedStreamOutput extends WrapperStreamOutput
{
  protected HasherStreamOutput encrypter;
  
  public EncryptedStreamOutput(StreamOutput out) throws Exception
  {
    this(out, Hash.DEFAULT);
  }
  
  public EncryptedStreamOutput(StreamOutput out, String algorithm) throws Exception
  {
    super(out);
    
    encrypter = new HasherStreamOutput(algorithm);
  }
  
  public void write(ByteArray buffer) throws Exception
  {
    os.write(buffer);
    encrypter.write(buffer);
  }
}
