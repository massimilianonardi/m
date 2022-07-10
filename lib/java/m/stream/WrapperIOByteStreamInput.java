package m.stream;

import java.io.*;

import m.object.*;

public class WrapperIOByteStreamInput implements StreamInput
{
  protected ByteArray buffer;
  protected InputStream is;
  protected boolean eos = false;
  
  public WrapperIOByteStreamInput(InputStream inputStream) throws Exception
  {
    buffer = new ByteArray();
    is = inputStream;
  }
  
  public InputStream getInputStream() throws Exception
  {
    return is;
  }
  
  public void close() throws Exception
  {
    is.close();
  }
  
  public boolean eos() throws Exception
  {
    return eos;
  }
  
  public ByteArray readBytes() throws Exception
  {
    buffer.length(is.read(buffer.buffer()));
    if(buffer.length() == -1)
    {
      eos = true;
    }
    return buffer;
  }
}
