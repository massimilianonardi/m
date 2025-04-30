package m.object;

import m.stream.*;

public interface SerializableOutput
{
  public void fromBufferByte(ByteArray object) throws Exception;
  
  default public void readFromStreamInput(StreamInput in) throws Exception
  {
    throw new Exception();
  }
  
  default public void readFromStreamInput(StreamObjectInput<ByteArray> in) throws Exception
  {
    throw new Exception();
  }
}
