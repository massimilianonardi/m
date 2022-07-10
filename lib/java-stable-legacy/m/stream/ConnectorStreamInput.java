package m.stream;

public interface ConnectorStreamInput
{
  public void streamFromInput(StreamInput in) throws Exception;
  
//  default public void streamFromInput(StreamInput in) throws Exception
//  {
//    throw new Exception();
//  }
}
