package m.store;

import m.stream.*;

public interface Store extends StoreSealedDeletable
{
//  public boolean exists(String id) throws Exception;
//  
//  public String create(StreamInput stream) throws Exception;
//  
//  public StreamInput sealed(String id) throws Exception;
//  public StreamSeekableInput read(String id) throws Exception;
//  
//  public StreamObjectInput<String> list() throws Exception;
//  public StreamObjectInput<String> find(Object params) throws Exception;
//  
//  
//  
//  public void delete(String id) throws Exception;
  
  
  
  public String create() throws Exception;
  public void create(String id) throws Exception;
  
  public void reindex(String id, String newID) throws Exception;
  public String copy(String id) throws Exception;
  
  public StreamSeekable edit(String id) throws Exception;
}
