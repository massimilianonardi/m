package m.service;

import java.util.*;
import java.sql.*;

import m.object.*;
import m.conf.*;
import m.auth.*;
import m.stream.*;
import m.sql.*;

public class DBReadWrite extends ConfigurableWrapper<Pool<Connection>> implements AuthorizedStatelessService
{
  static final public String CMD_READ = "read/";
  static final public String CMD_WRITE = "write/";
  
  public void execute(String command, ObjInput in, ObjOutput out) throws Exception
//  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    m.Global.log.debug(command);
    
    if(command.startsWith(CMD_READ))
    {
      read(command.substring(CMD_READ.length()), in, out);
    }
    else if(command.startsWith(CMD_WRITE))
    {
      write(command.substring(CMD_WRITE.length()), in, out);
    }
    else
    {
      throw new Exception();
    }
  }
  
  protected void read(String path, ObjInput in, ObjOutput out) throws Exception
  {
    SQLStatement sqlftm = new SQLStatement().sql(new SQLCommandHelper().select(path).limit(1).statement);
    Map<String, Integer> fieldTypeMap = execute(sqlftm).fieldTypeMap;
    
    List<String> cols = in.list("columns");
    List where = in.list("where");
    List<String> order = in.list("order");
    List<String> versus = in.list("versus");

    if(where == null)
    {
      where = new ArrayList();
    }
    
    SQLCommandHelper sqlh = new SQLCommandHelper();
    sqlh.select(path, cols);
    sqlh.where(fieldTypeMap, where, false);
    sqlh.order(order, versus);
    SQLStatement sql = sqlh.getSQLStatement();
    
    java.io.OutputStream os = ((WrapperIOByteStreamOutput) ((m.web.WebObjOutput) out).getStreamOutput()).getOutputStream();
    StreamOutputDataJSON sod = new StreamOutputDataJSON(os);
    
    execute(sql, sod);
  }
  
  protected void write(String path, ObjInput in, ObjOutput out) throws Exception
  {
    SQLStatement sqlftm = new SQLStatement().sql(new SQLCommandHelper().select(path).limit(1).statement);
    m.Global.log.debug(path, sqlftm.fields);
    Map<String, Integer> fieldTypeMap = execute(sqlftm).fieldTypeMap;
    
//    List<List<Map<String, Object>>> data = in.list();
    List<List<Map<String, Object>>> data = in.list("data");
    
    if(!data.isEmpty())
    {
      List<Map<String, Object>> row = null;
      for(int i = 0; i < data.size(); i++)
      {
        row = data.get(i);
        Map<String, Object> operationKeys = row.get(0);
        Map<String, Object> operationData = row.get(1);
        m.Global.log.debug(path, fieldTypeMap, operationKeys, operationData);
        SQLCommandHelper sqlh = new SQLCommandHelper().save(path, fieldTypeMap, operationKeys, operationData);
        SQLStatement sql = sqlh.getSQLStatement();
        execute(sql);
      }
    }
  }
  
  public SQLStatement execute(SQLStatement sql) throws Exception
  {
    Connection c = object.acquire();
    try
    {
      sql.execute(c);
      if(!c.getAutoCommit())
      {
        c.commit();
      }
    }
    catch(Exception e)
    {
      object.release(c);
      throw e;
    }
    object.release(c);
    
    return sql;
  }
  
  public SQLStatement execute(SQLStatement sql, StreamOutputData sod) throws Exception
  {
    Connection c = object.acquire();
    try
    {
      sql.out(sod).execute(c);
      if(!c.getAutoCommit())
      {
        c.commit();
      }
    }
    catch(Exception e)
    {
      object.release(c);
      throw e;
    }
    object.release(c);
    
    return sql;
  }
}
