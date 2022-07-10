package m.node;

import java.util.*;

import m.object.*;
import m.util.*;

public class NodeBase implements Node
{
//------------------------------------------------------------------------------

public class MapPaths extends BasicMap<Node>
{
//  protected Map<Object, Node> map = new HashMap<Object, Node>();
  
  protected Node thisNode;
  
  public MapPaths(Node thisNode)
  {
    this.thisNode = thisNode;
  }
  
//  public MapPaths(Node thisNode, Map<Object, Node> map)
//  {
//    this.thisNode = thisNode;
//    this.map = map;
//  }
  
  public void clear() throws Exception
  {
    for(Object k: map.keySet())
    {
      if(k instanceof String) remove((String) k);
      else if(k instanceof Long) remove((Long) k);
      else throw new Exception();
    }
  }
  
  public Node remove(String key) throws Exception
  {
//    if(!containsKey(key))
//    {
//      return null;
//    }
    
    Node child = super.remove(key);
    
    child.removeParent(key, thisNode);
    
    return child;
  }
  
  public Node remove(Long key) throws Exception
  {
    throw new Exception();
  }
  
  public void set(String key, Node child) throws Exception
  {
//    Node previous = get(key);
//    
//    if((child == null && previous == null) || (child != null && child.equals(previous)))
//    {
//      return;
//    }
    
    super.set(key, child);
    
    child.parent(key, thisNode);
  }
  
  public void set(Long key, Node child) throws Exception
  {
    throw new Exception();
  }
}

//------------------------------------------------------------------------------
  protected String id;
  
  protected NodeObject nodeObject = new NodeObjectBase();
  protected MultiMap<Node> parents = new BasicMultiMap<Node>();
  protected MultiMap<Node> ppaths = new BasicMultiMap<Node>();
  protected GenericMap<Node> paths = new MapPaths(this);
  
  public NodeBase() throws Exception
  {
    id = new IDGenerator().dateFormat("yyyy-MM-dd_HH-mm-ss").dateRandom();
  }
  
  public NodeBase(String id) throws Exception
  {
    this.id = id;
  }
  
//  public NodeBase(String id, m.stream.StreamInput in) throws Exception
//  {
//    this.id = id;
//    
//    Obj obj = new Obj();
//    obj.streamFromInput(in);
//    if(obj.object() != null)
//    {
//      if(obj.string("object") != null) nodeObject.set(obj.string("object"));
//      if(obj.map("parents") != null) parents = new BasicMultiMap<Node>(obj.map("parents"));
//      if(obj.map("ppaths") != null) ppaths = new BasicMultiMap<Node>(obj.map("ppaths"));
//      if(obj.map("paths") != null) paths = new MapPaths(this, obj.map("paths"));
//    }
//  }
//  
//  public void save(m.stream.StreamSeekableOutput out) throws Exception
//  {
//    Obj obj = new Obj();
//    obj.set("object", nodeObject.string());
//    obj.set("parents", ((BasicMultiMap<Node>) parents).map());
//    obj.set("ppaths", ((BasicMultiMap<Node>) ppaths).map());
//    obj.set("paths", ((MapPaths) paths).map);
//    
//    out.begin();
//    out.truncate();
//    obj.streamToOutput(out);
//    out.close();
//  }
  
  static HashSet<Node> visited = new HashSet<Node>();
  public String toString()
  {
    if(visited.contains(this))
    {
      return "@" + id;
    }
    
    visited.add(this);
    String res = "\n{\n  \"id\": " + id + "\n  \"object\": " + nodeObject.toString() + "\n  \"parents\": " + parents.toString() + "\n  \"ppaths\": " + ppaths.toString() + "\n  \"paths\": " + paths.toString() + "\n}\n";
    visited.remove(this);
//    return new com.google.gson.GsonBuilder().setPrettyPrinting().create().toJson(map);
    return res;
  }
  
  public String id() throws Exception
  {
    return id;
  }
  
  public NodeObject object() throws Exception
  {
    return nodeObject;
  }
  
  public void parent(String path, Node object) throws Exception
  {
    parents.set(object.id(), path, object);
    ppaths.set(path, object.id(), object);
  }
  
  public void removeParent(String path, Node object) throws Exception
  {
    parents.remove(object.id(), path);
    ppaths.remove(path, object.id());
  }
  
  public MultiMap<Node> parents() throws Exception
  {
    return parents;
  }
  
  public MultiMap<Node> ppaths() throws Exception
  {
    return ppaths;
  }
  
  public GenericMap<Node> paths() throws Exception
  {
    return paths;
  }
}
