package m.stream;

import m.object.*;

public class WrapperStreamInput implements StreamInput
{
  protected StreamInput is;
  
  public WrapperStreamInput(StreamInput in) throws Exception
  {
    is = in;
  }
  
  public StreamInput getStreamInput() throws Exception
  {
    return is;
  }
  
  public void close() throws Exception
  {
    is.close();
  }
  
  public boolean eos() throws Exception
  {
    return is.eos();
  }
  
  public ByteArray readBytes() throws Exception
  {
    return is.readBytes();
  }
}
