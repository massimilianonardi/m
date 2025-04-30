package m.store;

import m.object.*;
import m.node.*;
import m.stream.*;

abstract public class _AbstractStoreFileSealed implements StoreFile
{
  abstract public boolean fileExists(String index) throws Exception;
  
  final public String fileCreate() throws Exception {throw new Exception();}
  abstract public String fileCreate(StreamInput stream) throws Exception;
  final public void fileCreate(String index) throws Exception {throw new Exception();}
  final public void fileIndex(String index, String newIndex) throws Exception {throw new Exception();}
  final public String fileCopy(String index) throws Exception {throw new Exception();}
  abstract public void fileDelete(String index) throws Exception;
  
  abstract public StreamInput fileSealedStream(String index) throws Exception;
  abstract public StreamSeekableInput fileReadOnlyStream(String index) throws Exception;
  final public StreamSeekable fileStream(String index) throws Exception {throw new Exception();}
  
  abstract public ObjInput fileIndexList() throws Exception;
}
