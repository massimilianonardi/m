package m.stream;

public class WrapperStreamSeekableOutput extends WrapperStreamOutput implements StreamSeekableOutput
{
  protected StreamSeekableOutput os;
  
  public WrapperStreamSeekableOutput(StreamSeekableOutput out) throws Exception
  {
    super((StreamOutput) out);
    os = out;
  }
  
  public void begin() throws Exception
  {
    os.begin();
  }
  
  public void end() throws Exception
  {
    os.end();
  }
  
  public long size() throws Exception
  {
    return os.size();
  }
  
  public long position() throws Exception
  {
    return os.position();
  }
  
  public void position(long position) throws Exception
  {
    os.position(position);
  }
  
  public void seek(long seek) throws Exception
  {
    os.seek(seek);
  }
  
  public void truncate() throws Exception
  {
    os.truncate();
  }
  
  public void size(long position) throws Exception
  {
    os.size(position);
  }
}
