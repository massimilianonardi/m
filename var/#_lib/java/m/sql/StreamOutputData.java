package m.sql;

import java.io.*;
import java.util.*;

public interface StreamOutputData extends StreamOutput, DataObjectOutput
{
  public void write(String object) throws Exception;
  public void write(boolean object) throws Exception;
  public void write(long object) throws Exception;
  public void write(double object) throws Exception;
  public void write(Map object) throws Exception;
  public void write(List object) throws Exception;
  public void write(InputStream object) throws Exception;
  
//  public void write(String key, String object) throws Exception;
//  public void write(String key, long object) throws Exception;
//  public void write(String key, double object) throws Exception;
//  public void write(String key, Map object) throws Exception;
//  public void write(String key, List object) throws Exception;
//  public void write(String key, InputStream object) throws Exception;
  
//  public void write(int key, String object) throws Exception;
//  public void write(int key, long object) throws Exception;
//  public void write(int key, double object) throws Exception;
//  public void write(int key, Map object) throws Exception;
//  public void write(int key, List object) throws Exception;
//  public void write(int key, InputStream object) throws Exception;
  
  public void writeStart() throws Exception;
  public void writeEnd() throws Exception;
  public void writeMapStart() throws Exception;
  public void writeMapEnd() throws Exception;
  public void writeMapElementStart(String name) throws Exception;
  public void writeMapElementEnd(String name) throws Exception;
  public void writeMapElementSeparator() throws Exception;
  public void writeListStart() throws Exception;
  public void writeListEnd() throws Exception;
  public void writeListElementStart() throws Exception;
  public void writeListElementEnd() throws Exception;
  public void writeListElementSeparator() throws Exception;
}
