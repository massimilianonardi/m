package m.file;

import m.object.*;
import m.stream.*;
import m.enc.*;

public class ___HashBlockFSIH extends ___HashFSIH
{
  protected long size;
  
  public StreamSeekable stream(String path) throws Exception
  {
//    return new HashBlockFSIHStream(this, path, super.stream(path), 10240);
    throw new Exception();
  }
}
