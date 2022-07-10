package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.enc.*;
import m.file.*;
import m.stream.*;
import m.service.*;
import m.sql.*;
import m.util.IDGenerator;

public class DBAuthenticator extends DBReadWrite implements Authenticator
{
  static final long DEFAULT_TIMEOUT = 10000;
  
  protected String hash;
  protected Long timeout;
  protected IDGenerator idGenerator;
  
  protected Map<String, Obj> challenges = new LinkedHashMap<String, Obj>();
  protected Map<String, Timer> challengeTimers = new LinkedHashMap<String, Timer>();
  
  
  
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
    hash = params.string(Conf.HASH);
    if(hash == null)
    {
      hash = Hash.DEFAULT;
    }
    
    timeout = params.integer(Conf.TIMEOUT);
    if(timeout == null)
    {
      timeout = DEFAULT_TIMEOUT;
    }
    
    idGenerator = new IDGenerator().dateFormat("yyyy/MM/dd HH:mm:ss");
    
    super.configure(params);
    
    
    
    table = params.string(CONF_TABLE);
    columnID = params.string(CONF_COLUMN_ID);
    columnCredential = params.string(CONF_COLUMN_CREDENTIAL);
  }
  
  public ObjInput challenge(String id) throws Exception
  {
    Obj challenge = new Obj(idGenerator.dateRandom());
    challenges.put(id, challenge);
    
    TimerTask task = new TimerTask()
    {
      @Override
      public void run()
      {
        try
        {
          m.Global.log.debug(System.currentTimeMillis());
          challenges.remove(id);
          challengeTimers.remove(id);
        }
        catch(Exception e)
        {
          e.printStackTrace();
        }
      }
    };
    
    Timer timer = new Timer();
    timer.schedule(task, timeout);
    
    challengeTimers.put(id, timer);
    
    return challenge;
  }
  
  public ObjInput authenticate(String id, ObjInput challengeProof) throws Exception
  {
    if(challengeTimers.get(id) != null)
    {
      challengeTimers.get(id).cancel();
      challenges.remove(id);
      challengeTimers.remove(id);
    }
    
    ObjInput hashedCredential = getCredential(id);
    
    String proofVerification = Hash.hashString(hash, challengeProof.string());
    Boolean proven = proofVerification.equals(hashedCredential.string());
    
    ObjInput expiration = credentialExpiryCheck(id);
    
    Map<String, Object> res = new HashMap<String, Object>();
    res.put("authenticated", proven);
    res.put("expiration", expiration.map());
    
    return new Obj(res);
  }
  
  public ObjInput credentialExpiryCheck(String id) throws Exception
  {
    String expiration = getExpiration(id);
    
    String now = idGenerator.date();
    Boolean expired = expiration != null && expiration.compareTo(now) < 0;
    
    Map<String, Object> res = new HashMap<String, Object>();
    res.put("expired", expired);
    res.put("expiration", expiration);
    
    return new Obj(res);
  }
  
  public ObjInput credentialRenewal(String id, ObjInput challengeProof, ObjInput credentialNew, int renewalDays) throws Exception
  {
    ObjInput authn = authenticate(id, challengeProof);
    if(authn.bool("authenticated"))
    {
      ObjInput expiration = credentialReset(id, credentialNew, renewalDays);
      authn.map().put("expiration", expiration.object());
      
      return authn;
    }
    else
    {
      return authn;
    }
  }
  
  public ObjInput credentialReset(String id, ObjInput credentialNew, int renewalDays) throws Exception
  {
    setCredential(id, credentialNew);
    
    String expiration = idGenerator.date(renewalDays);
    if(renewalDays < 0)
    {
      expiration = "";
    }
    setExpiration(id, expiration);
    
    return new Obj(expiration);
  }
  
  public void add(String id, ObjInput credential) throws Exception
  {
    setCredential(id, credential);
  }
  
  public void remove(String id) throws Exception
  {
    _remove(id);
  }
  
  protected ObjInput getCredential(String id) throws Exception
  {
    String query = "select * from " + table + " where " + columnID + "='" + id.replace("'", "''") + "';";
//    m.Global.log.debug(query);
    SQLStatement sql = new SQLStatement().sql(query);
    execute(sql);
//    m.Global.log.debug(sql);
//    m.Global.log.debug(sql.data);
    if(sql.totalCount != 1)
    {
      throw new Exception();
    }
    
    return new Obj(sql.data.get("data").get(0).get(2).object());
  }
  
  protected void setCredential(String id, ObjInput credentialNew) throws Exception
  {
    String update = "update " + table + " set expiration=NULL, " + columnCredential + "=md5('" + credentialNew.string().replace("'", "''") + "') where " + columnID + "='" + id.replace("'", "''") + "';";
    SQLStatement sql = new SQLStatement().sql(update);
    execute(sql);
    if(sql.savedCount != 1)
    {
      throw new Exception();
    }
  }
  
  protected String getExpiration(String id) throws Exception
  {
    String query = "select * from " + table + " where " + columnID + "='" + id.replace("'", "''") + "';";
//    m.Global.log.debug(query);
    SQLStatement sql = new SQLStatement().sql(query);
    execute(sql);
//    m.Global.log.debug(sql);
//    m.Global.log.debug(sql.data);
    if(sql.totalCount != 1)
    {
      throw new Exception();
    }
    
    return sql.data.get("data").get(0).string(3);
  }
  
  protected void setExpiration(String id, String expirationNew) throws Exception
  {
    String update = "update " + table + " set expiration=" + ("".equals(expirationNew) ? null : "'" + expirationNew.replace("'", "''") + "'") + " where " + columnID + "='" + id.replace("'", "''") + "';";
    SQLStatement sql = new SQLStatement().sql(update);
    execute(sql);
    if(sql.savedCount != 1)
    {
      throw new Exception();
    }
  }
  
  
  
  public boolean _authenticate(String id, ObjInput credential) throws Exception
  {
    String query = "select * from " + table + " where " + columnID + "='" + id.replace("'", "''") + "' and " + columnCredential + "=md5('" + credential.string().replace("'", "''") + "');";
//    m.Global.log.debug(query);
    SQLStatement sql = new SQLStatement().sql(query);
    execute(sql);
//    m.Global.log.debug(sql);
//    m.Global.log.debug(sql.data);
    if(sql.totalCount == 1)
    {
      // login ok
      
      m.Global.log.debug(sql.data.get("data").get(0).get(3).object());
      if(sql.data.get("data").get(0).get(3).object() != null)
      {
        // must change password
//        System.out.println("PASSWORD EXPIRED!");
//        return false;
        throw new Exception();
      }
//      else
//      {
//        // todo get roles
//        System.out.println("GET PROFILE FROM CERTIFICATION!");
//      }
      
      return true;
    }
    else
    {
      // login error, username and/or password mismatch
      return false;
    }
  }
  
  public void _credential(String id, ObjInput credential, ObjInput credentialNew) throws Exception
  {
    String update = "update " + table + " set expiration=NULL, " + columnCredential + "=md5('" + credentialNew.string().replace("'", "''") + "') where " + columnID + "='" + id.replace("'", "''") + "';";
    SQLStatement sql = new SQLStatement().sql(update);
    execute(sql);
    if(sql.savedCount != 1)
    {
      throw new Exception();
    }
  }
  
  public void _add(String id, ObjInput credential) throws Exception
  {
//    String insert = "insert into " + table + " set expiration=NULL, " + columnCredential + "=md5('" + credential.string().replace("'", "''") + "'), " + columnID + "='" + id.replace("'", "''") + "';";
    String insert = "insert into " + table + " set expiration='2000-01-01', " + columnCredential + "=md5('" + credential.string().replace("'", "''") + "'), " + columnID + "='" + id.replace("'", "''") + "';";
    SQLStatement sql = new SQLStatement().sql(insert);
    execute(sql);
    if(sql.savedCount != 1)
    {
      throw new Exception();
    }
  }
  
  public void _remove(String id) throws Exception
  {
    String remove = "delete " + table + " where " + columnID + "='" + id.replace("'", "''") + "';";
    SQLStatement sql = new SQLStatement().sql(remove);
    execute(sql);
    if(sql.savedCount != 1)
    {
      throw new Exception();
    }
  }
  
  public String getProfileName(String id) throws Exception
  {
    String query = "select * from " + "auth.users_roles_view" + " where " + columnID + "='" + id.replace("'", "''") + "';";
//    m.Global.log.debug(query);
    SQLStatement sql = new SQLStatement().sql(query);
    execute(sql);
//    m.Global.log.debug(sql.data);
    if(sql.totalCount == 1)
    {
      m.Global.log.debug(sql.data.get("data").get(0).get(1).object());
      return sql.data.get("data").get(0).get(1).string();
    }
    else
    {
      throw new Exception();
    }
  }
}
