package m.stream;

public interface StreamObjectOutput<T>
{
  default public void close() throws Exception
  {
  }
  
  public void writeObject(T object) throws Exception;
  
  default public void streamFromInput(StreamObjectInput<T> in) throws Exception
  {
    T buffer = in.readObject();
    
    while(!in.eos())
    {
      writeObject(buffer);
      buffer = in.readObject();
    }
    
    in.close();
  }
}
