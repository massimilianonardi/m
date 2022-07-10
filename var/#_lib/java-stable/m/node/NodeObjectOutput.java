package m.node;

import m.object.*;
import m.stream.*;

public interface NodeObjectOutput
{
  public void set(String object) throws Exception;
  public void set(Boolean object) throws Exception;
  public void set(Long object) throws Exception;
  public void set(Double object) throws Exception;
  public void set(ByteArray object) throws Exception;
  public void set(StreamInput object) throws Exception;
//  public void set(StreamSeekableInput object) throws Exception;
  
  public void set(NodeObjectInput object) throws Exception;
}
