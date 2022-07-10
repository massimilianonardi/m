package m.stream;

public class WrapperStreamSeekableInput extends WrapperStreamInput implements StreamSeekableInput
{
  protected StreamSeekableInput is;
  
  public WrapperStreamSeekableInput(StreamSeekableInput in) throws Exception
  {
    super((StreamInput) in);
    is = in;
  }
  
  public void begin() throws Exception
  {
    is.begin();
  }
  
  public void end() throws Exception
  {
    is.end();
  }
  
  public long size() throws Exception
  {
    return is.size();
  }
  
  public long position() throws Exception
  {
    return is.position();
  }
  
  public void position(long position) throws Exception
  {
    is.position(position);
  }
  
  public void seek(long seek) throws Exception
  {
    is.seek(seek);
  }
}
