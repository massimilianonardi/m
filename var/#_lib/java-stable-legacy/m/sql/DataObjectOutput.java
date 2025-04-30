package m.sql;

import java.util.*;

public interface DataObjectOutput
{
  public void set(String object) throws Exception;
  public void set(Boolean object) throws Exception;
  public void set(Long object) throws Exception;
  public void set(Double object) throws Exception;
  public void set(Map object) throws Exception;
  public void set(List object) throws Exception;
//  public void set(InputStream object) throws Exception;
  public void set(DataObjectInput object) throws Exception;
  
  public void set(String key, String object) throws Exception;
  public void set(String key, Boolean object) throws Exception;
  public void set(String key, Long object) throws Exception;
  public void set(String key, Double object) throws Exception;
  public void set(String key, Map object) throws Exception;
  public void set(String key, List object) throws Exception;
//  public void set(String key, InputStream object) throws Exception;
  public void set(String key, DataObjectInput object) throws Exception;
  
  public void set(int key, String object) throws Exception;
  public void set(int key, Boolean object) throws Exception;
  public void set(int key, Long object) throws Exception;
  public void set(int key, Double object) throws Exception;
  public void set(int key, Map object) throws Exception;
  public void set(int key, List object) throws Exception;
//  public void set(int key, InputStream object) throws Exception;
  public void set(int key, DataObjectInput object) throws Exception;
  
  public void add(String value) throws Exception;
  public void add(Boolean object) throws Exception;
  public void add(Long value) throws Exception;
  public void add(Double value) throws Exception;
  public void add(Map value) throws Exception;
  public void add(List value) throws Exception;
//  public void add(InputStream value) throws Exception;
  public void add(DataObjectInput object) throws Exception;
}
