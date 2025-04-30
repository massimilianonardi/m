package m.stream;

import java.io.*;

import m.object.*;

public class WrapperIOByteStreamOutput implements StreamOutput
{
  protected OutputStream os;
  
  public WrapperIOByteStreamOutput(OutputStream outputStream) throws Exception
  {
    os = outputStream;
  }
  
  public OutputStream getOutputStream() throws Exception
  {
    return os;
  }
  
  public void close() throws Exception
  {
    os.close();
  }
  
  public void write(ByteArray buffer) throws Exception
  {
    os.write(buffer.buffer(), buffer.offset(), buffer.length());
  }
}
