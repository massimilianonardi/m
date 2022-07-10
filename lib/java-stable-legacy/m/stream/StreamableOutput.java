package m.stream;

import m.object.*;

public interface StreamableOutput extends ConnectorStreamOutput
{
  public ByteArray toBufferByte() throws Exception;
  
  default public StreamInput toStreamInput() throws Exception
  {
    return new WrapperIOByteStreamInput(new java.io.ByteArrayInputStream(toBufferByte().buffer()));
  }
}
