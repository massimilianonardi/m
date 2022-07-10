package m.stream;

public interface StreamableInput
{
  public void streamFromInput(StreamInput in) throws Exception;
  
//  default public void streamFromInput(StreamInput in) throws Exception
//  {
//    throw new Exception();
//  }
}
