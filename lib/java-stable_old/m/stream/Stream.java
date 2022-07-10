package m.stream;

public interface Stream extends StreamInput, StreamOutput
{
  default public void close() throws Exception
  {
  }
  
//  default public void close() throws Exception
//  {
//    throw new Exception();
//  }
}
