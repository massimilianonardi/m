package m.file;

import m.object.*;
import m.stream.*;
import m.enc.*;

public class ___HashBlockFSIHStream //extends OSFileHashedStream
{
  protected long size;
  
  public ___HashBlockFSIHStream(___HashFSIH fs, String streamPath, StreamSeekable stream, long blockSize) throws Exception
  {
//    super(fs, streamPath, stream);
    
    size = blockSize;
  }
}
