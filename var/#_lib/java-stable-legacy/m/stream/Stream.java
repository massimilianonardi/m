package m.stream;

public interface Stream extends StreamInput, StreamOutput, ConnectorStream
{
  default public void close() throws Exception
  {
  }
  
//  default public void close() throws Exception
//  {
//    throw new Exception();
//  }
}
