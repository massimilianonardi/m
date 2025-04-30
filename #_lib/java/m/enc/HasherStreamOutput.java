package m.enc;

import java.security.*;

import m.object.*;
import m.stream.*;

public class HasherStreamOutput implements StreamOutput
{
  protected String alg;
  protected MessageDigest md;
  protected byte[] hash;
  
  public HasherStreamOutput() throws Exception
  {
    this(Hash.DEFAULT);
  }
  
  public HasherStreamOutput(String algorithm) throws Exception
  {
    alg = algorithm;
    md = MessageDigest.getInstance(alg);
    hash = null;
  }
  
  public void close() throws Exception
  {
    hash = md.digest();
  }
  
  public void write(ByteArray buffer) throws Exception
  {
    hash = null;
    md.update(buffer.buffer(), buffer.offset(), buffer.length());
  }
  
  public void reset() throws Exception
  {
    hash = null;
    md.reset();
  }
  
  public byte[] hash() throws Exception
  {
    return hash;
  }
  
  public String toHEXString() throws Exception
  {
    return Encoding.toHEXString(hash());
  }
}
