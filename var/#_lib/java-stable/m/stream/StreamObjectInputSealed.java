package m.stream;

public interface StreamObjectInputSealed<T> extends StreamObjectInput<T>
{
  public boolean verifySeal() throws Exception;
}
