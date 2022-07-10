package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.util.*;
import m.file.*;
import m.stream.*;
import m.enc.*;
import m.sql.*;
import m.service.*;

public class DBAuthenticator extends BaseAuthenticator<DBReadWrite>
{
//  final static protected String CONF_DATABASE = "database";
  final static protected String CONF_TABLE = "table";
  final static protected String CONF_COLUMN_ID = "column.id";
  final static protected String CONF_COLUMN_CREDENTIAL = "column.credential";
  
//  protected String hash;
  
  protected String table;
  protected String columnID;
  protected String columnCredential;
  
  public void configure(Obj params) throws Exception
  {
    super.configure(params);
    
    table = params.string(CONF_TABLE);
    columnID = params.string(CONF_COLUMN_ID);
    columnCredential = params.string(CONF_COLUMN_CREDENTIAL);
  }
  
  protected ObjInput getCredential(String id) throws Exception
  {
    String query = "select * from " + table + " where " + columnID + "='" + id.replace("'", "''") + "';";
//    m.Global.log.debug(query);
    SQLStatement sql = new SQLStatement().sql(query);
    get().execute(sql);
//    m.Global.log.debug(sql);
//    m.Global.log.debug(sql.data);
    if(sql.totalCount != 1)
    {
      throw new Exception();
    }
    
    return new Obj(sql.data.get("data").get(0).get(2).object());
  }
  
  protected String getExpiration(String id) throws Exception
  {
    String query = "select * from " + table + " where " + columnID + "='" + id.replace("'", "''") + "';";
//    m.Global.log.debug(query);
    SQLStatement sql = new SQLStatement().sql(query);
    get().execute(sql);
//    m.Global.log.debug(sql);
//    m.Global.log.debug(sql.data);
    if(sql.totalCount != 1)
    {
      throw new Exception();
    }
    
//    return sql.data.get("data").get(0).string(3);
    return sql.data.get("data").get(0).object(3) == null ? null : sql.data.get("data").get(0).object(3).toString();
  }
}
