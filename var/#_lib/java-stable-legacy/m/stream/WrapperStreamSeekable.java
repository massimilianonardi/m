package m.stream;

public class WrapperStreamSeekable extends WrapperStream implements StreamSeekable
{
  protected StreamSeekable stream;
  
  public WrapperStreamSeekable(StreamSeekable stream) throws Exception
  {
    super((Stream) stream);
    this.stream = stream;
  }
  
  public void begin() throws Exception
  {
    stream.begin();
  }
  
  public void end() throws Exception
  {
    stream.end();
  }
  
  public long size() throws Exception
  {
    return stream.size();
  }
  
  public long position() throws Exception
  {
    return stream.position();
  }
  
  public void position(long position) throws Exception
  {
    stream.position(position);
  }
  
  public void seek(long seek) throws Exception
  {
    stream.seek(seek);
  }
  
  public void truncate() throws Exception
  {
    stream.truncate();
  }
  
  public void size(long position) throws Exception
  {
    stream.size(position);
  }
}
