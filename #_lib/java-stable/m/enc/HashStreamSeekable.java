package m.enc;

import m.object.*;
import m.stream.*;

public class HashStreamSeekable extends WrapperStreamSeekable
{
  protected HasherStreamOutput hasher;
  
  protected boolean hasRead = false;
  protected boolean hasWritten = false;
  protected boolean hasMoved = false;
  
  public HashStreamSeekable(StreamSeekable stream) throws Exception
  {
    this(stream, Hash.DEFAULT);
  }
  
  public HashStreamSeekable(StreamSeekable stream, String algorithm) throws Exception
  {
    super(stream);
    
    hasher = new HasherStreamOutput(algorithm);
  }
  
  public ByteArray readBytes() throws Exception
  {
    hasRead = true;
    
    ByteArray buffer = stream.readBytes();
    hasher.write(buffer);
    
    return buffer;
  }
  
  public void write(ByteArray buffer) throws Exception
  {
    hasWritten = true;
    
    stream.write(buffer);
    hasher.write(buffer);
  }
  
  public void begin() throws Exception
  {
    hasMoved = true;
    
    stream.begin();
  }
  
  public void end() throws Exception
  {
    hasMoved = true;
    
    stream.end();
  }
  
  public long size() throws Exception
  {
    return stream.size();
  }
  
  public long position() throws Exception
  {
    return stream.position();
  }
  
  public void position(long position) throws Exception
  {
    hasMoved = true;
    
    stream.position(position);
  }
  
  public void seek(long seek) throws Exception
  {
    hasMoved = true;
    
    stream.seek(seek);
  }
  
  public void truncate() throws Exception
  {
    hasWritten = true;
    hasMoved = true;
    
    stream.truncate();
  }
  
  public void size(long position) throws Exception
  {
    hasWritten = true;
    hasMoved = true;
    
    stream.size(position);
  }
  
  public void close() throws Exception
  {
    if(hasRead || hasWritten)
    {
      if((hasRead && hasWritten) || hasMoved || !eos())
      {
        hasher.reset();
        
        long currentPosition = stream.position();
        
        stream.begin();
        while(!stream.eos())
        {
          hasher.write(stream.readBytes());
        }
        
        stream.position(currentPosition);
      }
    }
    
    hasher.close();
  }
  
  public byte[] hash() throws Exception
  {
    return hasher.hash();
  }
  
  public String toHEXString() throws Exception
  {
    return hasher.toHEXString();
  }
}
