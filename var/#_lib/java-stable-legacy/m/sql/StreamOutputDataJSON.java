package m.sql;

import java.io.*;
import java.util.*;

import com.google.gson.*;

public class StreamOutputDataJSON extends StreamOutputDataBase
{
  static protected Gson gson = new Gson();
  
  public StreamOutputDataJSON(OutputStream out) throws Exception
  {
    super(out);
  }
  
  public void write(String object) throws Exception
  {
    write(gson.toJson(object).getBytes());
  }
  
  public void write(boolean object) throws Exception
  {
    write(gson.toJson(object).getBytes());
  }
  
  public void write(long object) throws Exception
  {
    write(gson.toJson(object).getBytes());
  }
  
  public void write(double object) throws Exception
  {
    write(gson.toJson(object).getBytes());
  }
  
  public void write(Map object) throws Exception
  {
    write(gson.toJson(object).getBytes());
  }
  
  public void write(List object) throws Exception
  {
    write(gson.toJson(object).getBytes());
  }
  
  public void write(InputStream object) throws Exception
  {
//    throw new Exception();
    byte[] buffer = new byte[4096];
    int length = object.read(buffer);
    while(0 < length)
    {
      write(buffer, 0, length);
      length = object.read(buffer);
    }
    object.close();
  }
  
  public void write(String key, String object) throws Exception
  {
    throw new Exception();
  }
  
  public void write(String key, long object) throws Exception
  {
    throw new Exception();
  }
  
  public void write(String key, double object) throws Exception
  {
    throw new Exception();
  }
  
  public void write(String key, Map object) throws Exception
  {
    throw new Exception();
  }
  
  public void write(String key, List object) throws Exception
  {
    throw new Exception();
  }
  
  public void write(String key, InputStream object) throws Exception
  {
    throw new Exception();
  }
  
  public void write(int key, String object) throws Exception
  {
    throw new Exception();
  }
  
  public void write(int key, long object) throws Exception
  {
    throw new Exception();
  }
  
  public void write(int key, double object) throws Exception
  {
    throw new Exception();
  }
  
  public void write(int key, Map object) throws Exception
  {
    throw new Exception();
  }
  
  public void write(int key, List object) throws Exception
  {
    throw new Exception();
  }
  
  public void write(int key, InputStream object) throws Exception
  {
    throw new Exception();
  }
  
  public void writeStart() throws Exception
  {
  }
  
  public void writeEnd() throws Exception
  {
  }
  
  public void writeMapStart() throws Exception
  {
    write('{');
  }
  
  public void writeMapEnd() throws Exception
  {
    write('}');
  }
  
  public void writeMapElementStart(String name) throws Exception
  {
    write(("\"" + name.replace("\"", "\\\"") + "\":").getBytes());
  }
  
  public void writeMapElementEnd(String name) throws Exception
  {
  }
  
  public void writeMapElementSeparator() throws Exception
  {
    write(',');
  }
  
  public void writeListStart() throws Exception
  {
    write('[');
  }
  
  public void writeListEnd() throws Exception
  {
    write(']');
  }
  
  public void writeListElementStart() throws Exception
  {
  }
  
  public void writeListElementEnd() throws Exception
  {
  }
  
  public void writeListElementSeparator() throws Exception
  {
    write(',');
  }
}
