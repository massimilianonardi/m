package m.sql;

public interface StreamOutput
{
  public void close() throws Exception;
  public void flush() throws Exception;
  
  public void write(int b) throws Exception;
  public void write(byte[] buffer) throws Exception;
  public void write(byte[] buffer, int length) throws Exception;
  public void write(byte[] buffer, int offset, int length) throws Exception;
}
