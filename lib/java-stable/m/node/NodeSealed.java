package m.node;

import m.object.*;

public interface NodeSealed
{
  public String id() throws Exception;
  public NodeObjectInput object() throws Exception;
  public MultiMapInput<? extends NodeSealed> parents() throws Exception;
  public MultiMapInput<? extends NodeSealed> ppaths() throws Exception;
  public GenericMapInput<? extends NodeSealed> paths() throws Exception;
}
