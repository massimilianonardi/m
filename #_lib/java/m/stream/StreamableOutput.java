package m.stream;

public interface StreamableOutput
{
  public void streamToOutput(StreamOutput out) throws Exception;
  
//  default public void streamToOutput(StreamOutput out) throws Exception
//  {
//    throw new Exception();
//  }
}
