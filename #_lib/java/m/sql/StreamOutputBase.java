package m.sql;

abstract public class StreamOutputBase implements StreamOutput
{
  protected StreamOutputBase()
  {
  }
  
  public void write(byte[] buffer) throws Exception
  {
    write(buffer, 0, buffer.length);
  }
  
  public void write(byte[] buffer, int length) throws Exception
  {
    write(buffer, 0, length);
  }
  
  public void write(byte[] buffer, int offset, int length) throws Exception
  {
    int len = offset + length;
    for(int i = offset; i < len; i++)
    {
      write(buffer[i]);
    }
  }
}
