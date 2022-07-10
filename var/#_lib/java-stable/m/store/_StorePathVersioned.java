package m.store;

import m.stream.*;

public interface _StorePathVersioned extends StorePath
{
  public String commit(String path) throws Exception;
  public String merge(StreamInput stream, String ... path) throws Exception;
  public void split(String path, String ... paths) throws Exception;
}
