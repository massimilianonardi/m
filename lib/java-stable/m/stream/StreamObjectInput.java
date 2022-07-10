package m.stream;

public interface StreamObjectInput<T>
{
  default public void close() throws Exception
  {
  }
  
  public boolean eos() throws Exception;
  public T readObject() throws Exception;
  
  default public void streamToOutput(StreamObjectOutput<T> out) throws Exception
  {
    T buffer = readObject();
    
    while(!eos())
    {
      out.writeObject(buffer);
      buffer = readObject();
    }
    
    close();
  }
}
