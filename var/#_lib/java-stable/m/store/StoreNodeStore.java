package m.store;

import java.util.*;

import m.conf.*;
import m.object.*;
import m.node.*;
import m.file.*;
import m.stream.*;
import m.util.*;

/*

it is not possible to use node-id=hash because of links ciclic dependancy, it is not possible to use object-hash, because it is initially empty and can always be
thus: node-id is unique date+random, main store keeps only node-hash (date+random -> node-hash), sealed store keeps node data with id=hash (node-hash -> data)

this store is fully editable that only keeps associations "date+random -> <node-object-hash, full-node-hash>" 
(or object-hash, parents-id/paths-hash, parents-paths/id-hash, paths-hash)
internal sealed store keeps versioned and sealed files by hash (node-object-files and full-node-files)
NO all internal stores are transparent "Store", then they may or may not provide versioning interface that will eventually be accessed through 
a subclass of this class that implements versioning by wrapping and reusing internal stores functionality

*/

public class StoreNodeStore implements StoreNode, ConfigurableObject
{
//------------------------------------------------------------------------------
public class NodeBase
{
  protected String id;
  
  protected String indexObject;
  protected String indexParents;
  protected String indexParentsPaths;
  protected String indexPaths;
  
//  protected MultiMap<String> parents = new BasicMultiMap<String>();
//  protected MultiMap<String> ppaths = new BasicMultiMap<String>();
//  protected GenericMap<String> paths = new BasicMap<String>();
  protected Map<String, Map<String, String>> parents;
  protected Map<String, Map<String, String>> ppaths;
  protected Map<String, String> paths;
  
  public NodeBase() throws Exception
  {
    id = new IDGenerator().dateFormat("yyyy-MM-dd_HH-mm-ss").dateRandom();
  }
  
  public NodeBase(String id) throws Exception
  {
    this.id = id;
  }
  
  public void loadIndexes() throws Exception
  {
    StreamSeekable stream = indexStore.edit(id);
    
    Obj obj = new Obj();
    obj.streamFromInput(stream);
    if(obj.object() != null)
    {
      indexObject = obj.string(NODE_OBJECT);
      indexParents = obj.string(NODE_PARENTS);
      indexParentsPaths = obj.string(NODE_PARENTS_PATHS);
      indexPaths = obj.string(NODE_PATHS);
    }
  }
  
  public void loadMergeIndexes() throws Exception
  {
    StreamSeekable stream = indexStore.edit(id);
    
    Obj obj = new Obj();
    obj.streamFromInput(stream);
    if(obj.object() != null)
    {
      String index = obj.string(NODE_OBJECT);
      if(index != null)
      {
        indexObject = index;
      }
      
      index = obj.string(NODE_PARENTS);
      if(index != null)
      {
        indexParents = index;
      }
      
      index = obj.string(NODE_PARENTS_PATHS);
      if(index != null)
      {
        indexParentsPaths = index;
      }
      
      index = obj.string(NODE_PATHS);
      if(index != null)
      {
        indexPaths = index;
      }
    }
  }
  
  // in memory indexes replace saved ones that should be deleted...this method should not be used/useful
  public void loadMergeMissingIndexes() throws Exception
  {
    StreamSeekable stream = indexStore.edit(id);
    
    Obj obj = new Obj();
    obj.streamFromInput(stream);
    if(obj.object() != null)
    {
      String index = obj.string(NODE_OBJECT);
      if(indexObject == null)
      {
        indexObject = index;
      }
      
      index = obj.string(NODE_PARENTS);
      if(indexParents == null)
      {
        indexParents = index;
      }
      
      index = obj.string(NODE_PARENTS_PATHS);
      if(indexParentsPaths == null)
      {
        indexParentsPaths = index;
      }
      
      index = obj.string(NODE_PATHS);
      if(indexPaths == null)
      {
        indexPaths = index;
      }
    }
  }
  
  public void saveIndexes() throws Exception
  {
    Obj obj = new Obj(new HashMap<String, Object>());
    if(indexObject != null)
    {
      obj.set(NODE_OBJECT, indexObject);
    }

    if(indexParents != null)
    {
      obj.set(NODE_PARENTS, indexParents);
    }

    if(indexParentsPaths != null)
    {
      obj.set(NODE_PARENTS_PATHS, indexParentsPaths);
    }

    if(indexPaths != null)
    {
      obj.set(NODE_PATHS, indexPaths);
    }
    
    StreamSeekable stream = indexStore.edit(id);
    stream.begin();
    stream.truncate();
    obj.streamToOutput(stream);
  }
  
  public Map loadData(String index) throws Exception
  {
    StreamSeekable stream = dataStore.edit(index);
    
    Obj obj = new Obj();
    obj.streamFromInput(stream);
    
    return obj.map();
  }
  
  public void saveData(String index, Object object) throws Exception
  {
    StreamSeekable stream = dataStore.edit(index);
    
    Obj obj = new Obj(object);
    
    stream.begin();
    stream.truncate();
    stream.write(obj);
//    obj.streamToOutput(stream);
    stream.close();
  }
  
  public String saveData(Object object) throws Exception
  {
    String index = dataStore.create();
    
    saveData(index, object);
    
    return index;
  }
  
  public void loadData() throws Exception
  {
    Map map;
    
    if(indexParents != null)
    {
      parents = loadData(indexParents);
    }
    else
    {
      parents = new HashMap<>();
    }

    if(indexParentsPaths != null)
    {
      ppaths = loadData(indexParentsPaths);
    }
    else
    {
      ppaths = new HashMap<>();
    }

    if(indexPaths != null)
    {
      paths = loadData(indexPaths);
    }
    else
    {
      paths = new HashMap<>();
    }
  }
  
  public void loadMergeData() throws Exception
  {
    Map map;
    
    if(indexParents != null)
    {
      map = loadData(indexParents);
      if(map != null)
      {
        parents = map;
      }
    }

    if(indexParentsPaths != null)
    {
      map = loadData(indexParentsPaths);
      if(map != null)
      {
        ppaths = map;
      }
    }

    if(indexPaths != null)
    {
      map = loadData(indexPaths);
      if(map != null)
      {
        paths = map;
      }
    }
  }
  
  public void saveData() throws Exception
  {
    if(parents != null)
    {
      if(indexParents != null && parents.isEmpty())
      {
        dataStore.delete(indexParents);
        indexParents = null;
      }
      else if(indexParents == null && !parents.isEmpty())
      {
        indexParents = saveData(parents);
      }
      else if(indexParents != null)
      {
        saveData(indexParents, parents);
      }
    }

    if(ppaths != null)
    {
      if(indexParentsPaths != null && ppaths.isEmpty())
      {
        dataStore.delete(indexParentsPaths);
        indexParentsPaths = null;
      }
      else if(indexParentsPaths == null && !ppaths.isEmpty())
      {
        indexParentsPaths = saveData(ppaths);
      }
      else if(indexParentsPaths != null)
      {
        saveData(indexParentsPaths, ppaths);
      }
    }

    if(paths != null)
    {
      if(indexPaths != null && paths.isEmpty())
      {
        dataStore.delete(indexPaths);
        indexPaths = null;
      }
      else if(indexPaths == null && !paths.isEmpty())
      {
        indexPaths = saveData(paths);
      }
      else if(indexPaths != null)
      {
        saveData(indexPaths, paths);
      }
    }
  }
  
  public void load() throws Exception
  {
    loadIndexes();
    loadData();
    
m.Global.log.debug();
  }
  
  public void save() throws Exception
  {
    saveData();
    saveIndexes();
    
m.Global.log.debug();
  }
}
//------------------------------------------------------------------------------
  
  static final protected String SEPARATOR = "/";
  
  static final protected String NODE_OBJECT = "object";
  static final protected String NODE_PARENTS = "parents";
  static final protected String NODE_PARENTS_PATHS = "ppaths";
  static final protected String NODE_PATHS = "paths";
  
  protected IDGenerator idGenerator;
  
  protected Store indexStore;
  protected Store dataStore;
  protected Store fileStore;
  
  protected String root;
  
  public StoreNodeStore() throws Exception
  {
//    idGenerator = new IDGenerator().dateFormat("yyyy/MM/dd/HH/mm/ss");
    idGenerator = new IDGenerator().dateFormat("yyyy-MM-dd_HH-mm-ss");
  }
  
  public void configure(Obj conf) throws Exception
  {
    indexStore = m.Global.objects.get(Store.class, conf.get(Conf.INDEX));
    dataStore = m.Global.objects.get(Store.class, conf.get(Conf.DATA));
    fileStore = m.Global.objects.get(Store.class, conf.get(Conf.STORE));
  }
  
  public boolean exists(String id) throws Exception
  {
    return indexStore.exists(id);
  }
  
  public String create(StreamInput stream) throws Exception
  {
    String id = create();
    edit(id).streamFromInput(stream);
    
    return id;
  }
  
  public StreamInput sealed(String id) throws Exception
  {
    return read(id);
  }
  
  public StreamSeekableInput read(String id) throws Exception
  {
    // return specific class that cannot be casted to an editable stream
    return edit(id);
  }
  
  public StreamObjectInput<String> list() throws Exception
  {
    return indexStore.list();
  }
  
  public StreamObjectInput<String> find(Object params) throws Exception
  {
    return indexStore.find(params);
  }
  
  public void delete(String id) throws Exception
  {
    NodeBase node = new NodeBase(id);
    
    node.load();
    
    String index = node.indexObject;
    if(index != null)
    {
      fileStore.delete(index);
    }
    
    index = node.indexParents;
    if(index != null)
    {
      dataStore.delete(index);
    }
    
    index = node.indexParentsPaths;
    if(index != null)
    {
      dataStore.delete(index);
    }
    
    index = node.indexPaths;
    if(index != null)
    {
      dataStore.delete(index);
    }
    
m.Global.log.debug(id);
    
    indexStore.delete(id);
  }
  
  synchronized public String create() throws Exception
  {
    return indexStore.create();
  }
  
  public void create(String id) throws Exception
  {
    indexStore.create(id);
  }
  
  public void reindex(String id, String newID) throws Exception
  {
    indexStore.reindex(id, newID);
  }
  
  public String copy(String id) throws Exception
  {
    throw new Exception();
//    return indexStore.copy(id);
  }
  
  public StreamSeekable edit(String id) throws Exception
  {
    NodeBase node = new NodeBase(id);
    
    node.load();
    
    String index = node.indexObject;
    if(index == null)
    {
      index = fileStore.create();
      node.indexObject = index;
      node.save();
    }
m.Global.log.debug(id, index);
    
    return fileStore.edit(index);
  }
  
  public String root() throws Exception
  {
    return root;
  }
  
  public void root(String id) throws Exception
  {
    root = id;
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
    NodeBase node = new NodeBase(id);
    
    node.load();
    
    return new StreamObjectSet<String>(node.parents.keySet());
  }
  
  public StreamObjectInput<String> parentNodePaths(String id, String parentID) throws Exception
  {
    NodeBase node = new NodeBase(id);
    
    node.load();
    
    return new StreamObjectSet<String>(node.parents.get(parentID).keySet());
  }
  
  public StreamObjectInput<String> parentPaths(String id) throws Exception
  {
    NodeBase node = new NodeBase(id);
    
    node.load();
    
    return new StreamObjectSet<String>(node.ppaths.keySet());
  }
  
  public StreamObjectInput<String> parentPathNodes(String id, String path) throws Exception
  {
    NodeBase node = new NodeBase(id);
    
    node.load();
    
    return new StreamObjectSet<String>(node.ppaths.get(path).keySet());
  }
  
  public StreamObjectInput<String> childNodesByPath(String id) throws Exception
  {
    NodeBase node = new NodeBase(id);
    
    node.load();
    
    return new StreamObjectMapKeyValue(node.paths, SEPARATOR);
  }
  
  public void link(String parentID, String childID, String path) throws Exception
  {
    NodeBase parent = new NodeBase(parentID);
    NodeBase child = new NodeBase(childID);
    
    parent.load();
    child.load();
    
    parent.paths.put(path, childID);
    
    Map<String, String> map = child.parents.get(parentID);
    if(map == null)
    {
      map = new HashMap<String, String>();
      child.parents.put(parentID, map);
    }
    map.put(path, "");
    
    map = child.ppaths.get(path);
    if(map == null)
    {
      map = new HashMap();
      child.ppaths.put(path, map);
    }
    map.put(parentID, "");
    
    parent.save();
    child.save();
    
//m.Global.log.debug(parentID, childID, path);
m.Global.log.debug(parentID, childID, path, parent.paths, child.parents, child.ppaths);
  }
  
//  public void unlink(String parentID, String childID) throws Exception
//  {
//    StreamObjectInput<String> stream = parentPathsByNodeID(childID, parentID);
//    
//    while(!stream.eos())
//    {
//      unlink(parentID, childID, stream.readObject());
//    }
//    
//    stream.close();
//  }
  
  public void unlink(String parentID, String childID, String path) throws Exception
  {
    NodeBase parent = new NodeBase(parentID);
    NodeBase child = new NodeBase(childID);
    
    parent.load();
    child.load();
    
    parent.paths.remove(path);
    
    Map map = child.parents.get(parentID);
    if(map != null)
    {
      map.remove(path);
      if(map.isEmpty())
      {
        child.parents.remove(parentID);
      }
    }
    
    map = child.ppaths.get(path);
    if(map != null)
    {
      map.remove(parentID);
      if(map.isEmpty())
      {
        child.ppaths.remove(path);
      }
    }
    
    parent.save();
    child.save();
    
//m.Global.log.debug(parentID, childID, path);
m.Global.log.debug(parentID, childID, path, parent.paths, child.parents, child.ppaths);
  }
}
