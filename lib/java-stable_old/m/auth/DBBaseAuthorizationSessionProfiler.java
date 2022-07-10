package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.util.*;
import m.file.*;
import m.stream.*;
import m.service.*;
import m.sql.*;

public class DBBaseAuthorizationSessionProfiler extends BaseAuthorizationSessionProfiler<DBReadWrite> implements AuthorizationSession.Profiler
{
//  final static protected String CONF_TABLE = "table";
//  final static protected String CONF_COLUMN_KEY = "column.key";
//  final static protected String CONF_COLUMN_VALUE = "column.value";
//  
//  protected String table;
//  protected String columnKey;
//  protected String columnValue;
  
//  protected PrefixMap<Authenticator> authns = new PrefixMap();
//  public PrefixMap<Authenticator> authns = new PrefixMap();
  
  protected DBReadWrite db;
  protected FileSystem fs;
  
  protected Map<String, AuthorizationSession> sessions = new HashMap();
  protected Map<String, Map<String, Boolean>> profiles = new HashMap();
  
  public void configure(Obj params) throws Exception
  {
    super.configure(params);
    
    db = get();
    fs = m.Global.objects.get(FileSystem.class, params.get("fs"));
    
//    rules = params.get("rules");
//    triggers = params.get("triggers");
    
    m.Global.log.debug(rules.object(), triggers.object());
    
//    db = m.Global.objects.get(DBReadWrite.class, params.get(Conf.DB));
    
//    table = params.get(Conf.DB).string(CONF_TABLE);
//    columnKey = params.get(Conf.DB).string(CONF_COLUMN_KEY);
//    columnValue = params.get(Conf.DB).string(CONF_COLUMN_VALUE);
  }
  
  protected Obj loadRules() throws Exception
  {
//    return rules;
    return new Obj(new HashMap());
//    return null;
//    return getObj("auth.profiler", "path", "name", "rules.json");
  }
  
  protected Obj loadTriggers() throws Exception
  {
//    return triggers;
    return new Obj(new HashMap());
//    return null;
//    return getObj("auth.profiler", "path", "name", "triggers.json");
  }
  
  protected String loadMappingName(String key) throws Exception
  {
    String name;
//    Obj profileObj = getObj("auth.profiler", "path", "name", key);
    Obj profileObj = getObj("auth.users_roles_view", "username", "role", key.replace("authentication/id/", ""));
//    Obj profileObj = getObj("auth.roles", "name", "profile", getObj("auth.users_roles_view", "username", "role", key.replace("authentication/id/", "")).string());
    name = profileObj.string();
    
    return "role/" + name;
  }
  
  protected String loadRuleMapping(String key, String value, String profile, Obj rule) throws Exception
  {
    Obj geolocation = rule.get("geolocation");
    if(geolocation != null && "network/public-network".equals(profile))
    {
//m.Global.log.debug(key, value, profile, rule.object());
      return ipGeoLocation(value);
    }
    
    return null;
  }
  
  protected void loadTrigger(String key, String value, Obj trigger) throws Exception
  {
    Obj geolocation = trigger.get("geolocation");
    if(geolocation != null)
    {
//m.Global.log.debug(key, value, trigger.object());
      profileChangeAdd("network/" + ipGeoLocation(value));
    }
  }
  
  protected String ipGeoLocation(String ipString) throws Exception
  {
    return IPAddress.ipGeoLocation(ipString, fs.root() + "/ip-geolocation.csv");
  }
  
  protected Map<String, Boolean> loadProfile(String key) throws Exception
  {
    Map<String, Boolean> profile;
    
//    Obj profileObj = getObj("auth.profiles", "path", "profile", key);
//    Obj profileObj = getObj("auth.roles", "name", "profile", getObj("auth.users_roles_view", "username", "role", key).string());
//    Obj profileObj = getObj("auth.roles", "name", "profile", getObj("auth.users_roles_view", "username", "role", key).string());
    Obj profileObj = getObj("auth.roles", "name", "profile", key);
//    if(profileObj.type(String.class)) profileObj.set(new HashMap());
    if(profileObj.type(String.class))
    {
  m.Global.log.debug(key, profileObj.string());
      profileObj.parse(profileObj.string());
    }
    profile = profileObj.map();
  m.Global.log.debug(key, profile);
    
    return profile;
  }
  
  protected Obj loadConf(String key) throws Exception
  {
    return new Obj(new HashMap());
//    return null;
//    Obj profileObj = getObj("auth.profiles", "path", "conf", key);
//    
//    return profileObj;
  }
  
  protected Obj getObj(String table, String columnKey, String columnValue, String key) throws Exception
  {
    Obj obj = new Obj();
    
    String query = "select " + columnKey + "," + columnValue + " from " + table + " where " + columnKey + "='" + key + "';";
//  m.Global.log.debug(query);
    SQLStatement sql = new SQLStatement().sql(query);
    db.execute(sql);
//  m.Global.log.debug(sql.data);
    if(sql.totalCount == 1)
    {
      String profileJSON = sql.data.get("data").get(0).get(1).string();
//    m.Global.log.debug(query, sql.data.get("data").object(), obj.object());
//      obj.fromBufferByte(new ByteArray(profileJSON.getBytes()));
//      obj.parse(profileJSON);
      obj.set(profileJSON);
    }
    else
    {
//      throw new Exception();
    }
//    m.Global.log.debug(obj);
    m.Global.log.debug(query, obj.object());
    
    return obj;
  }
}
