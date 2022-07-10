package m.stream;

public interface StreamableObjectInput<T>
{
  public StreamObjectInput<T> toStream() throws Exception;
}
