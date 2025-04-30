package m.stream;

public interface StreamableObject<T> extends StreamableObjectInput<T>, StreamableObjectOutput<T>
{
  public StreamObject<T> toStream() throws Exception;
}
