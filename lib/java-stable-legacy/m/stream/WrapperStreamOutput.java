package m.stream;

import m.object.*;

public class WrapperStreamOutput implements StreamOutput
{
  protected StreamOutput os;
  
  public WrapperStreamOutput(StreamOutput out) throws Exception
  {
    os = out;
  }
  
  public StreamOutput getStreamOutput() throws Exception
  {
    return os;
  }
  
  public void close() throws Exception
  {
    os.close();
  }
  
  public void write(ByteArray buffer) throws Exception
  {
    os.write(buffer);
  }
}
