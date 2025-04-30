package m.stream;

import m.object.*;

public interface StreamInput extends ConnectorStreamOutput
{
  default public void close() throws Exception
  {
  }
  
  default public boolean isObjStream() throws Exception
  {
    return false;
  }
  
  public boolean eos() throws Exception;
  public ByteArray readBytes() throws Exception;
  
  default public Obj readObj() throws Exception
  {
    Obj obj = new Obj();
    obj.fromBufferByte(readBytes());
    return obj;
  }
  
  default public void streamToOutput(StreamOutput out) throws Exception
  {
    ByteArray buffer = readBytes();
    while(!eos() || 0 < buffer.length())
    {
      out.write(buffer);
      buffer = readBytes();
    }
    
    close();
  }
  
//  default public void close() throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public boolean isObjStream() throws Exception
//  {
//    return false;
//  }
//  
//  default public boolean eos() throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public ByteArray readBytes() throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public Obj readObj() throws Exception
//  {
//    Obj obj = new Obj();
//    obj.fromBufferByte(readBytes());
//    return obj;
//  }
//  
//  default public void streamToOutput(StreamOutput out) throws Exception
//  {
//    ByteArray buffer = readBytes();
//    while(!eos())
//    {
//      out.write(buffer);
//      buffer = readBytes();
//    }
//  }
}
