package m.stream;

import m.object.*;

public class WrapperStream implements Stream
{
  protected Stream stream;
  
  public WrapperStream(Stream stream) throws Exception
  {
    this.stream = stream;
  }
  
  public Stream getStream() throws Exception
  {
    return stream;
  }
  
  public void close() throws Exception
  {
    stream.close();
  }
  
  public boolean eos() throws Exception
  {
    return stream.eos();
  }
  
  public ByteArray readBytes() throws Exception
  {
    return stream.readBytes();
  }
  
  public void write(ByteArray buffer) throws Exception
  {
    stream.write(buffer);
  }
}
