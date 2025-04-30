package m.sql;

import java.util.*;

public interface DataObjectInput
{
  public String type() throws Exception;
  
  public String string() throws Exception;
  public Boolean bool() throws Exception;
  public Long integer() throws Exception;
  public Double decimal() throws Exception;
  public Map map() throws Exception;
  public List list() throws Exception;
  public Object object() throws Exception;
  
  public String string(String key) throws Exception;
  public Boolean bool(String key) throws Exception;
  public Long integer(String key) throws Exception;
  public Double decimal(String key) throws Exception;
  public Map map(String key) throws Exception;
  public List list(String key) throws Exception;
  public Object object(String key) throws Exception;
  public DataObjectInput get(String key) throws Exception;
  
  public String string(int key) throws Exception;
  public Boolean bool(int key) throws Exception;
  public Long integer(int key) throws Exception;
  public Double decimal(int key) throws Exception;
  public Map map(int key) throws Exception;
  public List list(int key) throws Exception;
  public Object object(int key) throws Exception;
  public DataObjectInput get(int key) throws Exception;
//  public InputStream stream() throws Exception;
//  public InputStream stream(String key) throws Exception;
//  public InputStream stream(int key) throws Exception;
}
