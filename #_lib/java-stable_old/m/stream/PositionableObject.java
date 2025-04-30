package m.stream;

public interface PositionableObject extends SizedObject, SeekableObject
{
  default public void begin() throws Exception {position(0);};
  default public void end() throws Exception {position(size() - 1);};
  public long position() throws Exception;
  public void position(long position) throws Exception;
}
