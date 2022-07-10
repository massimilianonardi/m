package m.enc;

import m.stream.*;

public class HashStreamSeekableInput extends HashStreamInput
{
  protected StreamSeekableInput is;
  
  protected boolean rehashNeeded = false;
  
  public HashStreamSeekableInput(StreamSeekableInput in) throws Exception
  {
    super((StreamInput) in);
    
    is = in;
  }
  
  public void begin() throws Exception
  {
    rehashNeeded = true;
    
    is.begin();
  }
  
  public void end() throws Exception
  {
    rehashNeeded = true;
    
    is.end();
  }
  
  public long size() throws Exception
  {
    return is.size();
  }
  
  public long position() throws Exception
  {
    return is.position();
  }
  
  public void position(long position) throws Exception
  {
    rehashNeeded = true;
    
    is.position(position);
  }
  
  public void seek(long seek) throws Exception
  {
    rehashNeeded = true;
    
    is.seek(seek);
  }
  
  public byte[] hash() throws Exception
  {
    if(rehashNeeded)
    {
      is.begin();
      while(!is.eos())
      {
        hasher.write(is.readBytes());
      }
      
      rehashNeeded = false;
    }
    
    return hasher.hash();
  }
  
  public String toHEXString() throws Exception
  {
    return hasher.toHEXString();
  }
}
