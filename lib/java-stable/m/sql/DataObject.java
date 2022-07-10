package m.sql;

import java.util.*;

public interface DataObject extends DataObjectInput, DataObjectOutput
{
  public DataObject get(String key) throws Exception;
  public DataObject get(int key) throws Exception;
//  public Map map() throws Exception;
//  public List list() throws Exception;
//  
//  public DataObject object(String key) throws Exception;
//  public DataObject object(int key) throws Exception;
//  
//  public String string(String key) throws Exception;
//  public long integer(String key) throws Exception;
//  public double decimal(String key) throws Exception;
//  
//  public String string(int key) throws Exception;
//  public long integer(int key) throws Exception;
//  public double decimal(int key) throws Exception;
//  
//  public void set(String key, String value) throws Exception;
//  public void set(String key, long value) throws Exception;
//  public void set(String key, double value) throws Exception;
//  public void set(String key, DataObject value) throws Exception;
//  
//  public void set(int key, String value) throws Exception;
//  public void set(int key, long value) throws Exception;
//  public void set(int key, double value) throws Exception;
//  public void set(int key, DataObject value) throws Exception;
//  
//  public void add(String value) throws Exception;
//  public void add(long value) throws Exception;
//  public void add(double value) throws Exception;
//  public void add(DataObject value) throws Exception;
}
