package m.store;

import m.object.*;
import m.file.*;
import m.stream.*;

public interface StorePath extends FileSystem
{
  public interface Attribute extends ObjInput, ObjOutput
  {
  }
  
  default public Attribute attribute(String path) throws Exception {return null;}
  default public void attribute(String path, Attribute attribute) throws Exception {throw new Exception();}
  
//  default public void file(String path, StreamInput stream) throws Exception {stream(path).streamFromInput(stream);}
  default public String file(String path, StreamInput stream) throws Exception {stream(path).streamFromInput(stream); return null;}
  default public StreamInput linked(String path) throws Exception {throw new Exception();}
}
