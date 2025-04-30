package m.object;

import m.stream.*;

public class ByteArray //implements Streamable
{
  static public final int DEFAULT = 4096;
  
  protected byte[] buffer;
  protected int size;
  protected int offset;
  protected int length;
  
  public ByteArray() throws Exception
  {
    size(DEFAULT);
  }
  
  public ByteArray(int initialSize) throws Exception
  {
    size(initialSize);
  }
  
  public ByteArray(byte[] buffer) throws Exception
  {
    buffer(buffer);
  }
  
  public byte[] buffer() throws Exception
  {
    return buffer;
  }
  
  public void buffer(byte[] newBuffer) throws Exception
  {
    buffer = newBuffer;
    size = buffer.length;
    offset = 0;
    length = size;
  }
  
  public int size() throws Exception
  {
    return size;
  }
  
  public ByteArray size(int newSize) throws Exception
  {
    size = newSize;
    buffer = new byte[size];
    offset = 0;
    length = size;
    
    return this;
  }
  
  public void clear() throws Exception
  {
    size(size);
  }
  
  public int offset() throws Exception
  {
    return offset;
  }
  
  public ByteArray offset(int newOffset) throws Exception
  {
    if(size < newOffset + length)
    {
      throw new Exception();
    }
    
    offset = newOffset;
    
    return this;
  }
  
  public int length() throws Exception
  {
    return length;
  }
  
  public ByteArray length(int newLength) throws Exception
  {
    if(size < offset + newLength)
    {
      throw new Exception();
    }
    
    length = newLength;
    
    return this;
  }
  
//  public void fromBufferByte(ByteArray b) throws Exception
//  {
//    // todo make copy
//    buffer = b.buffer;
//    size = b.size;
//    offset = b.offset;
//    length = b.length;
//  }
//  
//  public ByteArray toBufferByte() throws Exception
//  {
//    // todo return copy
//    return this;
//  }
//  
//  public void streamFromInput(StreamInput in) throws Exception
//  {
//    // todo
//    throw new Exception();
//  }
//  
//  public void streamToOutput(StreamOutput out) throws Exception
//  {
//    // todo
//    throw new Exception();
//  }
}
