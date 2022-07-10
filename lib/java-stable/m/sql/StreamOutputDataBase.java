package m.sql;

import java.io.*;
import java.util.*;

abstract public class StreamOutputDataBase extends StreamOutputBase implements StreamOutputData
{
  protected OutputStream out;
  
  protected boolean isStarted = false;
  protected boolean isClosed = false;
  protected boolean isMapStarted = false;
  protected boolean isListStarted = false;
  protected boolean isMapNotEmpty = false;
  protected boolean isListNotEmpty = false;
  protected int currentListIndex = 0;
  
  public StreamOutputDataBase(OutputStream out) throws Exception
  {
    setOutputStream(out);
  }
  
  public OutputStream getOutputStream() throws Exception
  {
    return out;
  }
  
  public void setOutputStream(OutputStream out) throws Exception
  {
    if(out == null)
    {
      throw new Exception();
    }
    this.out = out;
  }
  
  public void close() throws Exception
  {
    if(isMapStarted)
    {
      writeMapEnd();
    }
    
    if(isListStarted)
    {
      writeListEnd();
    }
    
    if(isStarted)
    {
      writeEnd();
    }
    
    out.close();
  }
  
  public void flush() throws Exception
  {
    out.flush();
  }
  
  public void write(int b) throws Exception
  {
    out.write(b);
  }
  
  public void write(byte[] buffer, int offset, int length) throws Exception
  {
    out.write(buffer, offset, length);
  }
  
  public void set(String object) throws Exception
  {
    if(isClosed)
    {
      throw new Exception();
    }
    
    writeStart();
    write(object);
    writeEnd();
    
    isClosed = true;
  }
  
  public void set(Boolean object) throws Exception
  {
    if(isClosed)
    {
      throw new Exception();
    }
    
    writeStart();
    write(object);
    writeEnd();
    
    isClosed = true;
  }
  
  public void set(Long object) throws Exception
  {
    if(isClosed)
    {
      throw new Exception();
    }
    
    writeStart();
    write(object);
    writeEnd();
    
    isClosed = true;
  }
  
  public void set(Double object) throws Exception
  {
    if(isClosed)
    {
      throw new Exception();
    }
    
    writeStart();
    write(object);
    writeEnd();
    
    isClosed = true;
  }
  
  public void set(Map object) throws Exception
  {
    if(isClosed)
    {
      throw new Exception();
    }
    
    writeStart();
    write(object);
    writeEnd();
    
    isClosed = true;
  }
  
  public void set(List object) throws Exception
  {
    if(isClosed)
    {
      throw new Exception();
    }
    
    writeStart();
    write(object);
    writeEnd();
    
    isClosed = true;
  }
  
//  public void set(InputStream object) throws Exception
//  {
//    this.object = object;
//  }
  
  public void set(DataObjectInput object) throws Exception
  {
    if(isClosed)
    {
      throw new Exception();
    }
    
    writeStart();
    this.getClass().getMethod("write", object.object().getClass()).invoke(this, object.object());
    writeEnd();
    
    isClosed = true;
  }
  
  public void set(String key, String object) throws Exception
  {
    if(isClosed || isListStarted)
    {
      throw new Exception();
    }
    
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
    write(object);
    writeMapElementEnd(key);
  }
  
  public void set(String key, Boolean object) throws Exception
  {
    if(isClosed || isListStarted)
    {
      throw new Exception();
    }
    
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
    write(object);
    writeMapElementEnd(key);
  }
  
  public void set(String key, Long object) throws Exception
  {
    if(isClosed || isListStarted)
    {
      throw new Exception();
    }
    
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
    write(object);
    writeMapElementEnd(key);
  }
  
  public void set(String key, Double object) throws Exception
  {
    if(isClosed || isListStarted)
    {
      throw new Exception();
    }
    
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
    write(object);
    writeMapElementEnd(key);
  }
  
  public void set(String key, Map object) throws Exception
  {
    if(isClosed || isListStarted)
    {
      throw new Exception();
    }
    
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
    write(object);
    writeMapElementEnd(key);
  }
  
  public void set(String key, List object) throws Exception
  {
    if(isClosed || isListStarted)
    {
      throw new Exception();
    }
    
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
    write(object);
    writeMapElementEnd(key);
  }
  
//  public void set(String key, InputStream object) throws Exception
//  {
//    ((Map) this.object).put(key, object);
//  }
  
  public void set(String key, DataObjectInput object) throws Exception
  {
    if(isClosed || isListStarted)
    {
      throw new Exception();
    }
    
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
    this.getClass().getMethod("write", object.object().getClass()).invoke(this, object.object());
    writeMapElementEnd(key);
  }
  
  public void set(int key, String object) throws Exception
  {
    if(key != currentListIndex)
    {
      throw new Exception();
    }
    
    add(object);
    
    currentListIndex++;
  }
  
  public void set(int key, Boolean object) throws Exception
  {
    if(key != currentListIndex)
    {
      throw new Exception();
    }
    
    add(object);
    
    currentListIndex++;
  }
  
  public void set(int key, Long object) throws Exception
  {
    if(key != currentListIndex)
    {
      throw new Exception();
    }
    
    add(object);
    
    currentListIndex++;
  }
  
  public void set(int key, Double object) throws Exception
  {
    if(key != currentListIndex)
    {
      throw new Exception();
    }
    
    add(object);
    
    currentListIndex++;
  }
  
  public void set(int key, Map object) throws Exception
  {
    if(key != currentListIndex)
    {
      throw new Exception();
    }
    
    add(object);
    
    currentListIndex++;
  }
  
  public void set(int key, List object) throws Exception
  {
    if(key != currentListIndex)
    {
      throw new Exception();
    }
    
    add(object);
    
    currentListIndex++;
  }
  
//  public void set(int key, InputStream object) throws Exception
//  {
//    ((List) this.object).add(key, object);
//  }
  
  public void set(int key, DataObjectInput object) throws Exception
  {
    if(key != currentListIndex)
    {
      throw new Exception();
    }
    
    add(object);
    
    currentListIndex++;
  }
  
  public void add(String object) throws Exception
  {
    if(isClosed || isMapStarted)
    {
      throw new Exception();
    }
    
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
    write(object);
    writeListElementEnd();
  }
  
  public void add(Boolean object) throws Exception
  {
    if(isClosed || isMapStarted)
    {
      throw new Exception();
    }
    
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
    write(object);
    writeListElementEnd();
  }
  
  public void add(Long object) throws Exception
  {
    if(isClosed || isMapStarted)
    {
      throw new Exception();
    }
    
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
    write(object);
    writeListElementEnd();
  }
  
  public void add(Double object) throws Exception
  {
    if(isClosed || isMapStarted)
    {
      throw new Exception();
    }
    
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
    write(object);
    writeListElementEnd();
  }
  
  public void add(Map object) throws Exception
  {
    if(isClosed || isMapStarted)
    {
      throw new Exception();
    }
    
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
    write(object);
    writeListElementEnd();
  }
  
  public void add(List object) throws Exception
  {
    if(isClosed || isMapStarted)
    {
      throw new Exception();
    }
    
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
    write(object);
    writeListElementEnd();
  }
  
//  public void add(InputStream value) throws Exception
//  {
//    ((List) this.object).add(object);
//  }
  
  public void add(DataObjectInput object) throws Exception
  {
    if(isClosed || isMapStarted)
    {
      throw new Exception();
    }
    
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
    this.getClass().getMethod("write", object.object().getClass()).invoke(this, object.object());
    writeListElementEnd();
  }
}
