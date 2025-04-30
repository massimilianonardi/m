package m.stream;

import m.object.*;

abstract public class ObjOutputStream extends WrapperStreamOutput implements ObjOutput
{
  protected boolean isStarted = false;
  protected boolean isClosed = false;
  protected boolean isMapStarted = false;
  protected boolean isListStarted = false;
  protected boolean isMapNotEmpty = false;
  protected boolean isListNotEmpty = false;
  protected int currentListIndex = 0;
  
  public ObjOutputStream(StreamOutput out) throws Exception
  {
    super(out);
  }
  
  public void close() throws Exception
  {
    if(isClosed)
    {
      return;
    }
    
    if(isStarted)
    {
      if(isListStarted)
      {
        writeListEnd();
      }
      else if(isMapStarted)
      {
        writeMapEnd();
      }
      
      writeEnd();
    }
    
    isClosed = true;
  }
  
  public void set(ByteArray object) throws Exception
  {
    write(object);
    
//    close();
  }
  
  public void set(StreamInput object) throws Exception
  {
    streamFromInput(object);
//    if(!object.isObjStream())
//    {
//      streamFromInput(object);
//    }
//    else
//    {
//      while(!object.eos())
//      {
//        add(object.readObj());
//      }
//    }
    
//    close();
  }
  
  public void set(String key, ByteArray object) throws Exception
  {
//    if(!isClosed || isListStarted)
//    {
//      close();
//    }
    
//    if(isClosed || isListStarted)
//    {
//      throw new Exception();
//    }
    
    if(!isStarted)
    {
      isStarted = true;
      writeStart();
    }
    
    if(!isMapStarted)
    {
      isMapStarted = true;
      writeMapStart();
    }
    
    if(isMapNotEmpty)
    {
      writeMapElementSeparator();
    }
    
    writeMapElementStart(key);
    writeBinary(object);
    writeMapElementEnd(key);
  }
  
  public void set(String key, StreamInput object) throws Exception
  {
//    if(!isClosed || isListStarted)
//    {
//      close();
//    }
    
//    if(isClosed || isListStarted)
//    {
//      throw new Exception();
//    }
    
    if(!isStarted)
    {
      isStarted = true;
      writeStart();
    }
    
    if(!isMapStarted)
    {
      isMapStarted = true;
      writeMapStart();
    }
    
    if(isMapNotEmpty)
    {
      writeMapElementSeparator();
    }
    
    writeMapElementStart(key);
    writeStream(object);
    writeMapElementEnd(key);
  }
  
  public void set(String key, ObjInput object) throws Exception
  {
//    if(!isClosed || isListStarted)
//    {
//      close();
//    }
    
//    if(isClosed || isListStarted)
//    {
//      throw new Exception();
//    }
    
    if(!isStarted)
    {
      isStarted = true;
      writeStart();
    }
    
    if(!isMapStarted)
    {
      isMapStarted = true;
      writeMapStart();
    }
    
    if(isMapNotEmpty)
    {
      writeMapElementSeparator();
    }
    
    writeMapElementStart(key);
    writeObject(object.object());
    writeMapElementEnd(key);
  }
  
  public void set(int key, ByteArray object) throws Exception
  {
    if(key != currentListIndex)
    {
      throw new Exception();
    }
    
    addObject(object);
    
    currentListIndex++;
  }
  
  public void set(int key, StreamInput object) throws Exception
  {
    if(key != currentListIndex)
    {
      throw new Exception();
    }
    
    addObject(object);
    
    currentListIndex++;
  }
  
  public void set(int key, ObjInput object) throws Exception
  {
    if(key != currentListIndex)
    {
      throw new Exception();
    }
    
    addObject(object);
    
    currentListIndex++;
  }
  
  public void add(ByteArray object) throws Exception
  {
//    if(!isClosed || isMapStarted)
//    {
//      close();
//    }
    
//    if(isClosed || isMapStarted)
//    {
//      throw new Exception();
//    }
    
    if(!isStarted)
    {
      isStarted = true;
      writeStart();
    }
    
    if(!isListStarted)
    {
      isListStarted = true;
      writeListStart();
    }
    
    if(isListNotEmpty)
    {
      writeListElementSeparator();
    }
    
    writeListElementStart();
    writeBinary(object);
    writeListElementEnd();
    
    isListNotEmpty = true;
  }
  
  public void add(StreamInput object) throws Exception
  {
//    if(!isClosed || isMapStarted)
//    {
//      close();
//    }
    
//    if(isClosed || isMapStarted)
//    {
//      throw new Exception();
//    }
    
    if(!isStarted)
    {
      isStarted = true;
      writeStart();
    }
    
    if(!isListStarted)
    {
      isListStarted = true;
      writeListStart();
    }
    
    if(isListNotEmpty)
    {
      writeListElementSeparator();
    }
    
    writeListElementStart();
    writeStream(object);
    writeListElementEnd();
    
    isListNotEmpty = true;
  }
  
  public void add(ObjInput object) throws Exception
  {
//    if(!isClosed || isMapStarted)
//    {
//      close();
//    }
    
//    if(isClosed || isMapStarted)
//    {
//      throw new Exception();
//    }
    
    if(!isStarted)
    {
      isStarted = true;
      writeStart();
    }
    
    if(!isListStarted)
    {
      isListStarted = true;
      writeListStart();
    }
    
    if(isListNotEmpty)
    {
      writeListElementSeparator();
    }
    
    writeListElementStart();
    writeObject(object.object());
    writeListElementEnd();
    
    isListNotEmpty = true;
  }
  
  public void setObject(Object object) throws Exception
  {
//    if(!isClosed)
//    {
//      close();
//    }
    
//    if(isClosed)
//    {
//      throw new Exception();
//    }
    
    writeStart();
    writeObject(object);
    writeEnd();
    
//    isClosed = true;
  }
  
  public void setObject(String key, Object object) throws Exception
  {
//    if(!isClosed || isListStarted)
//    {
//      close();
//    }
    
//    if(isClosed || isListStarted)
//    {
//      throw new Exception();
//    }
    
    if(!isStarted)
    {
      isStarted = true;
      writeStart();
    }
    
    if(!isMapStarted)
    {
      isMapStarted = true;
      writeMapStart();
    }
    
    if(isMapNotEmpty)
    {
      writeMapElementSeparator();
    }
    
    writeMapElementStart(key);
    writeObject(object);
    writeMapElementEnd(key);
  }
  
  public void setObject(int key, Object object) throws Exception
  {
    if(key != currentListIndex)
    {
      throw new Exception();
    }
    
    addObject(object);
    
    currentListIndex++;
  }
  
  public void addObject(Object object) throws Exception
  {
//    if(!isClosed || isMapStarted)
//    {
//      close();
//    }
    
//    if(isClosed || isMapStarted)
//    {
//      throw new Exception();
//    }
    
    if(!isStarted)
    {
      isStarted = true;
      writeStart();
    }
    
    if(!isListStarted)
    {
      isListStarted = true;
      writeListStart();
    }
    
    if(isListNotEmpty)
    {
      writeListElementSeparator();
    }
    
    writeListElementStart();
    writeObject(object);
    writeListElementEnd();
    
    isListNotEmpty = true;
  }
  
  protected void writeBinary(ByteArray object) throws Exception
  {
    // todo encoding necessary???
    write(object);
    throw new Exception();
  }
  
  protected void writeStream(StreamInput object) throws Exception
  {
    // todo encoding necessary???
//    if(!object.isObjStream())
//    {
//      streamFromInput(object);
//    }
//    else
//    {
//      while(!object.eos())
//      {
//        add(object.readObj());
//      }
//    }
    throw new Exception();
  }
  
  protected void writeObject(Object object) throws Exception
  {
    throw new Exception();
  }
  
  protected void writeStart() throws Exception
  {
    throw new Exception();
  }
  
  protected void writeEnd() throws Exception
  {
    throw new Exception();
  }
  
  protected void writeMapStart() throws Exception
  {
    throw new Exception();
  }
  
  protected void writeMapEnd() throws Exception
  {
    throw new Exception();
  }
  
  protected void writeMapElementStart(String name) throws Exception
  {
    throw new Exception();
  }
  
  protected void writeMapElementEnd(String name) throws Exception
  {
    throw new Exception();
  }
  
  protected void writeMapElementSeparator() throws Exception
  {
    throw new Exception();
  }
  
  protected void writeListStart() throws Exception
  {
    throw new Exception();
  }
  
  protected void writeListEnd() throws Exception
  {
    throw new Exception();
  }
  
  protected void writeListElementStart() throws Exception
  {
    throw new Exception();
  }
  
  protected void writeListElementEnd() throws Exception
  {
    throw new Exception();
  }
  
  protected void writeListElementSeparator() throws Exception
  {
    throw new Exception();
  }
}
