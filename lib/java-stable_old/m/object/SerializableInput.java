package m.object;

import m.stream.*;

public interface SerializableInput
{
  public ByteArray toBufferByte() throws Exception;
  
  default public void writeToStreamOutput(StreamOutput out) throws Exception
  {
    out.write(toBufferByte());
//    out.close();
  }
  
  default public void writeToStreamOutput(StreamObjectOutput<ByteArray> out) throws Exception
  {
    out.writeObject(toBufferByte());
//    out.close();
  }
}
