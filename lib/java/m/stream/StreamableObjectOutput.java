package m.stream;

public interface StreamableObjectOutput<T>
{
  public StreamObjectOutput<T> toStream() throws Exception;
}
