package m.stream;

public interface StreamObjectOutputSealable<T> extends StreamObjectOutput<T>
{
  public void seal() throws Exception;
}
