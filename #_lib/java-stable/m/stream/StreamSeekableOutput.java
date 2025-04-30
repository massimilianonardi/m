package m.stream;

public interface StreamSeekableOutput extends StreamOutput, Seekable
{
  default public void truncate() throws Exception
  {
    size(position());
  }
  
  public void size(long size) throws Exception;
  
//  // edit
//  default public void truncate() throws Exception
//  {
//    size(position());
//  }
//  
//  default public void size(long size) throws Exception
//  {
//    throw new Exception();
//  }
}
