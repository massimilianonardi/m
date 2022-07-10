package m.auth;

import java.util.*;

import javax.naming.*;
import javax.naming.directory.*;
import javax.security.auth.login.*;

import m.object.*;
import m.conf.*;
import m.enc.*;
import m.file.*;
import m.stream.*;
import m.service.*;
import m.util.IDGenerator;

public class ActiveDirectoryAuthenticator implements Authenticator, ConfigurableObject
{
  private static final String CONTEXT_FACTORY_CLASS = "com.sun.jndi.ldap.LdapCtxFactory";
  private String ldapServerUrls[];
  private int lastLdapUrlIndex;
//  private final String domainName;
  private String domainName;
  
  
  static final long DEFAULT_TIMEOUT = 10000;
  
//  protected String hash;
  protected Long timeout;
  protected IDGenerator idGenerator;
  
  protected Map<String, Obj> challenges = new LinkedHashMap<String, Obj>();
  protected Map<String, Timer> challengeTimers = new LinkedHashMap<String, Timer>();
  
  
  
////  final static protected String CONF_DATABASE = "database";
//  final static protected String CONF_TABLE = "table";
//  final static protected String CONF_COLUMN_ID = "column.id";
//  final static protected String CONF_COLUMN_CREDENTIAL = "column.credential";
//  
////  protected String hash;
//  
//  protected String table;
//  protected String columnID;
//  protected String columnCredential;
  
  public void configure(Obj params) throws Exception
  {
//    hash = params.string(Conf.HASH);
//    if(hash == null)
//    {
//      hash = Hash.DEFAULT;
//    }
    
    timeout = params.integer(Conf.TIMEOUT);
    if(timeout == null)
    {
      timeout = DEFAULT_TIMEOUT;
    }
    
    idGenerator = new IDGenerator().dateFormat("yyyy/MM/dd HH:mm:ss");
    
//    super.configure(params);
//    
//    
//    
//    table = params.string(CONF_TABLE);
//    columnID = params.string(CONF_COLUMN_ID);
//    columnCredential = params.string(CONF_COLUMN_CREDENTIAL);
    
    domainName = params.string(Conf.SERVER);
    try
    {
      ldapServerUrls = nsLookup(domainName);
    }
    catch(Exception e)
    {
      e.printStackTrace();
    }
    lastLdapUrlIndex = 0;
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
    
//    ObjInput hashedCredential = getCredential(id);
//    
//    String proofVerification = Hash.hashString(hash, challengeProof.string());
//    Boolean proven = proofVerification.equals(hashedCredential.string());
//    
//    ObjInput expiration = credentialExpiryCheck(id);
    
//    Boolean proven = authenticate("mnardi", "colob.01");
    Boolean proven = authenticate(id, challengeProof.string());
//    ObjInput expiration = new Obj("3000-01-01");
    
    Map<String, Object> res = new HashMap<String, Object>();
    res.put("authenticated", proven);
//    res.put("expiration", expiration.map());
    
    return new Obj(res);
  }
  
  public boolean authenticate(String username, String password) throws LoginException
  {
    if (ldapServerUrls == null || ldapServerUrls.length == 0) {
        throw new AccountException("Unable to find ldap servers");
    }
    if (username == null || password == null || username.trim().length() == 0 || password.trim().length() == 0) {
        throw new FailedLoginException("Username or password is empty");
    }
    int retryCount = 0;
    int currentLdapUrlIndex = lastLdapUrlIndex;
    do {
        retryCount++;
        try {
            Hashtable<Object, Object> env = new Hashtable<Object, Object>();
            env.put(Context.INITIAL_CONTEXT_FACTORY, CONTEXT_FACTORY_CLASS);
            env.put(Context.PROVIDER_URL, ldapServerUrls[currentLdapUrlIndex]);
            env.put(Context.SECURITY_PRINCIPAL, username + "@" + domainName);
            env.put(Context.SECURITY_CREDENTIALS, password);
            DirContext ctx = new InitialDirContext(env);
            ctx.close();
            lastLdapUrlIndex = currentLdapUrlIndex;
            return true;
        } catch (CommunicationException exp) {
            exp.printStackTrace(); // TODO you can replace with log4j or slf4j API
            // if the exception of type communication we can assume the AD is not reachable hence retry can be attempted with next available AD
            if (retryCount < ldapServerUrls.length) {
                currentLdapUrlIndex++;
                if (currentLdapUrlIndex == ldapServerUrls.length) {
                    currentLdapUrlIndex = 0;
                }
                continue;
            }
            return false;
        } catch (Throwable throwable) {
            throwable.printStackTrace();
            return false;
        }
    } while (true);
  }
  
  private static String[] nsLookup(String argDomain) throws Exception
  {
    try {
        Hashtable<Object, Object> env = new Hashtable<Object, Object>();
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.dns.DnsContextFactory");
        env.put("java.naming.provider.url", "dns:");
        DirContext ctx = new InitialDirContext(env);
        Attributes attributes = ctx.getAttributes(String.format("_ldap._tcp.%s", argDomain), new String[] { "srv" });
        // try thrice to get the KDC servers before throwing error
        for (int i = 0; i < 3; i++) {
            Attribute a = attributes.get("srv");
            if (a != null) {
                List<String> domainServers = new ArrayList<String>();
                NamingEnumeration<?> enumeration = a.getAll();
                while (enumeration.hasMoreElements()) {
                    String srvAttr = (String) enumeration.next();
                    // the value are in space separated 0) priority 1)
                    // weight 2) port 3) server
                    String values[] = srvAttr.toString().split(" ");
                    domainServers.add(String.format("ldap://%s:%s", values[3], values[2]));
                }
                String domainServersArray[] = new String[domainServers.size()];
                domainServers.toArray(domainServersArray);
                return domainServersArray;
            }
        }
        throw new Exception("Unable to find srv attribute for the domain " + argDomain);
    } catch (NamingException exp) {
        throw new Exception("Error while performing nslookup. Root Cause: " + exp.getMessage(), exp);
    }
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
    throw new Exception();
  }
  
  public void remove(String id) throws Exception
  {
    throw new Exception();
  }
  
  protected ObjInput getCredential(String id) throws Exception
  {
    throw new Exception();
  }
  
  protected void setCredential(String id, ObjInput credentialNew) throws Exception
  {
    throw new Exception();
  }
  
  protected String getExpiration(String id) throws Exception
  {
    throw new Exception();
  }
  
  protected void setExpiration(String id, String expirationNew) throws Exception
  {
    throw new Exception();
  }
}
