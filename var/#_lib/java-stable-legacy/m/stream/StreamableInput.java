package m.stream;

import m.object.*;

public interface StreamableInput extends ConnectorStreamInput
{
  public void fromBufferByte(ByteArray object) throws Exception;
  
//  default public void fromBufferByte(ByteArray object) throws Exception
//  {
//    throw new Exception();
//  }
}
