package m.store;

import m.object.*;
import m.node.*;
import m.file.*;
import m.stream.*;

public class StoreNodeFS extends StoreFS implements StoreNode
{
  public StoreNodeFS() throws Exception
  {
    super();
  }
  
  public String root() throws Exception
  {
    throw new Exception();
  }
  
  public void root(String id) throws Exception
  {
    throw new Exception();
  }
  
  public String nodeIDFromPath(String id, String path) throws Exception
  {
    throw new Exception();
  }
  
  public String pathFromReversePath(String reversePath) throws Exception
  {
    throw new Exception();
  }
  
  public StreamObjectInput<String> pathsBetweenNodes(String idSource, String idDest) throws Exception
  {
    throw new Exception();
  }
  
  public StreamObjectInput<String> parentsBetweenNodes(String idSource, String idDest) throws Exception
  {
    throw new Exception();
  }
  
  public StreamObjectInput<String> parentNodes(String id) throws Exception
  {
    throw new Exception();
  }
  
  public StreamObjectInput<String> parentNodePaths(String id, String parentID) throws Exception
  {
    throw new Exception();
  }
  
  public StreamObjectInput<String> parentPaths(String id) throws Exception
  {
    throw new Exception();
  }
  
  public StreamObjectInput<String> parentPathNodes(String id, String path) throws Exception
  {
    throw new Exception();
  }
  
  public StreamObjectInput<String> childNodesByPath(String id) throws Exception
  {
    throw new Exception();
  }
  
  public void link(String parentID, String childID, String path) throws Exception
  {
    throw new Exception();
  }
  
//  public void unlink(String parentID, String childID) throws Exception
//  {
//    throw new Exception();
//  }
  
  public void unlink(String parentID, String childID, String path) throws Exception
  {
    throw new Exception();
  }
}
