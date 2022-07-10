package m.node;

import m.object.*;

public interface Node extends NodeSealed
{
//  public String id() throws Exception;
  public NodeObject object() throws Exception;
  public void parent(String path, Node object) throws Exception;
  public void removeParent(String path, Node object) throws Exception;
  public MultiMapInput<Node> parents() throws Exception;
  public MultiMapInput<Node> ppaths() throws Exception;
  public GenericMap<Node> paths() throws Exception;
}
