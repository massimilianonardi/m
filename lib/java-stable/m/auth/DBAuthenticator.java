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

public class DBAuthenticator extends BaseAuthenticator<DBReadWrite> implements AuthenticatorManager
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
  
  public Boolean authenticate(String id, ObjInput challengeProof) throws Exception
  {
    if(id == null && challengeProof == null) return null;
    
    return super.authenticate(id, challengeProof);
  }
  
  protected ObjInput getCredentialObj(String id) throws Exception
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
  
  public String getExpiration(String id) throws Exception
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
  
  public boolean exists(String id) throws Exception
  {
    throw new Exception();
  }
  
  public void add(String id, String credential) throws Exception
  {
    throw new Exception();
  }
  
  public void remove(String id) throws Exception
  {
    throw new Exception();
  }
  
  public String getCredential(String id) throws Exception
  {
    return getCredentialObj(id).string();
  }
  
  public void setCredential(String id, String credentialNew) throws Exception
  {
    String update = "update " + table + " set expiration=NULL, " + columnCredential + "=md5('" + credentialNew.replace("'", "''") + "') where " + columnID + "='" + id.replace("'", "''") + "';";
    SQLStatement sql = new SQLStatement().sql(update);
    get().execute(sql);
    if(sql.savedCount != 1)
    {
      throw new Exception();
    }
  }
  
  public void setExpiration(String id, String expirationNew) throws Exception
  {
    String update = "update " + table + " set expiration=" + ("".equals(expirationNew) ? null : "'" + expirationNew.replace("'", "''") + "'") + " where " + columnID + "='" + id.replace("'", "''") + "';";
    SQLStatement sql = new SQLStatement().sql(update);
    get().execute(sql);
    if(sql.savedCount != 1)
    {
      throw new Exception();
    }
  }
}
