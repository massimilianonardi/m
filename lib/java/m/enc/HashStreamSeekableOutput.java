package m.enc;

import m.stream.*;

public class HashStreamSeekableOutput extends HashStreamOutput
{
  protected StreamSeekableOutput os;
  
  protected boolean rehashNeeded = false;
  
  public HashStreamSeekableOutput(StreamSeekableOutput out) throws Exception
  {
    super((StreamOutput) out);
    
    os = out;
  }
  
  public void begin() throws Exception
  {
    rehashNeeded = true;
    
    os.begin();
  }
  
  public void end() throws Exception
  {
    rehashNeeded = true;
    
    os.end();
  }
  
  public long size() throws Exception
  {
    return os.size();
  }
  
  public long position() throws Exception
  {
    return os.position();
  }
  
  public void position(long position) throws Exception
  {
    rehashNeeded = true;
    
    os.position(position);
  }
  
  public void seek(long seek) throws Exception
  {
    rehashNeeded = true;
    
    os.seek(seek);
  }
  
  public void truncate() throws Exception
  {
    rehashNeeded = true;
    
    os.truncate();
  }
  
  public void size(long position) throws Exception
  {
    rehashNeeded = true;
    
    os.size(position);
  }
  
  public byte[] hash() throws Exception
  {
    if(rehashNeeded)
    {
      throw new Exception();
    }
    
    return hasher.hash();
  }
  
  public String toHEXString() throws Exception
  {
    return hasher.toHEXString();
  }
}
