package m.stream;

public interface StreamObjectPositionable<T> extends StreamObjectPositionableInput<T>, StreamObjectPositionableOutput<T>
{
  default public void close() throws Exception
  {
  }
}
