package m.stream;

public interface StreamObject<T> extends StreamObjectInput<T>, StreamObjectOutput<T>
{
  default public void close() throws Exception
  {
  }
}
