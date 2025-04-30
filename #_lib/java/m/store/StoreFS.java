package m.store;

import m.conf.*;
import m.object.*;
import m.file.*;
import m.stream.*;
import m.util.*;

//public class StoreFS extends CHRootFileSystem implements Store
public class StoreFS extends ConfigurableWrapper<FileSystem> implements Store
{
  protected IDGenerator idGenerator;
  
  public StoreFS() throws Exception
  {
//    idGenerator = new IDGenerator().dateFormat("yyyy/MM/dd/HH/mm/ss");
    idGenerator = new IDGenerator().dateFormat("yyyy-MM-dd_HH-mm-ss");
  }
  
  public boolean exists(String id) throws Exception
  {
    return get().exists(id) && get().isFile(id);
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
    return new IteratorStreamObjectInput<String>(get().list("").list().iterator());
  }
  
  public StreamObjectInput<String> find(Object params) throws Exception
  {
    return new IteratorStreamObjectInput<String>(get().find((String) params, null).list().iterator());
  }
  
  public void delete(String id) throws Exception
  {
    get().delete(id);
  }
  
  synchronized public String create() throws Exception
  {
    String id = idGenerator.dateRandom();
    
    if(exists(id))
    {
      id = idGenerator.dateRandom();
    }
    
    if(exists(id))
    {
      id = idGenerator.dateRandom();
    }
    
    if(exists(id))
    {
      throw new Exception();
    }
    
    get().nodes(get().parent(id));
    get().file(id);
    
    return id;
  }
  
  public void create(String id) throws Exception
  {
    get().nodes(get().parent(id));
    get().file(id);
  }
  
  public void reindex(String id, String newID) throws Exception
  {
    get().nodes(get().parent(newID));
    get().move(id, newID);
  }
  
  public String copy(String id) throws Exception
  {
    String newID = create();
    get().copy(id, newID, true, false);
    
    return newID;
  }
  
  public StreamSeekable edit(String id) throws Exception
  {
    return get().stream(id);
  }
}
