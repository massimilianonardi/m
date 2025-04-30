package m.stream;

import m.object.*;

public interface StreamOutput
{
  default public void close() throws Exception
  {
  }
  
  public void write(ByteArray object) throws Exception;
  
  default public void write(Obj object) throws Exception
  {
    write(object.toBufferByte());
  }
  
  default public void streamFromInput(StreamInput in) throws Exception
  {
    ByteArray buffer = in.readBytes();
    while(!in.eos())
    {
      write(buffer);
      buffer = in.readBytes();
    }
    
    in.close();
  }
  
//  default public void close() throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void write(ByteArray object) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void write(Obj object) throws Exception
//  {
//    write(object.toBufferByte());
//  }
//  
//  default public void streamFromInput(StreamInput in) throws Exception
//  {
//    ByteArray buffer = in.readBytes();
//    while(!in.eos())
//    {
//      StreamOutput.this.write(buffer);
//      buffer = in.readBytes();
//    }
//  }
}
