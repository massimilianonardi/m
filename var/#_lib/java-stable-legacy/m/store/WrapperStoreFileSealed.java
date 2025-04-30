package m.store;

import m.stream.*;

public class WrapperStoreFileSealed extends WrapperStoreFile
{
  final public String fileCreate() throws Exception
  {
    throw new Exception();
  }
  
  final public void fileCreate(String index) throws Exception
  {
    throw new Exception();
  }
  
  final public void fileIndex(String index, String newIndex) throws Exception
  {
    throw new Exception();
  }
  
  final public String fileCopy(String index) throws Exception
  {
    throw new Exception();
  }
  
  final public StreamSeekable fileStream(String index) throws Exception
  {
    throw new Exception();
  }
}
