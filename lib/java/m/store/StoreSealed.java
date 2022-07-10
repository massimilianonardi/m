package m.store;

import m.stream.*;

public interface StoreSealed
{
  public boolean exists(String id) throws Exception;
  
  public String create(StreamInput stream) throws Exception;
  
  public StreamInput sealed(String id) throws Exception;
  public StreamSeekableInput read(String id) throws Exception;
  
  public StreamObjectInput<String> list() throws Exception;
  public StreamObjectInput<String> find(Object params) throws Exception;
}
