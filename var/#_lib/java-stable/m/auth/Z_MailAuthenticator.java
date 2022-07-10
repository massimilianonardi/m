package m.auth;

import java.util.*;

import javax.mail.*;

import m.object.*;
import m.conf.*;
import m.enc.*;
import m.file.*;
import m.stream.*;
//import m.service.*;
import m.util.IDGenerator;

public class Z_MailAuthenticator implements Z_AuthenticatorManager, ConfigurableObject
//public class MailAuthenticator implements Authenticator, ConfigurableObject
{
  static final long DEFAULT_TIMEOUT = 10000;
  
  protected String server;
  protected Long port;
  protected String protocol;
  protected Boolean secure;
  
  protected String hash;
  protected Long timeout;
  protected IDGenerator idGenerator;
  
  protected Map<String, Obj> challenges = new LinkedHashMap<String, Obj>();
  protected Map<String, Timer> challengeTimers = new LinkedHashMap<String, Timer>();
  
  public void configure(Obj params) throws Exception
  {
    server = params.string(Conf.SERVER);
    if(server == null)
    {
      server = "127.0.0.1";
    }
    
    protocol = params.string(Conf.PROTOCOL);
    if(protocol == null)
    {
      protocol = "imap";
    }
    
    secure = params.bool(Conf.SECURE);
//    if(secure == null)
//    {
//      secure = false;
//    }
    
    port = params.integer(Conf.PORT);
//    if(port == null)
//    {
//      if("imap".equals(protocol))
//      {
//        if(secure == false)
//        {
//          port = 143L;
//        }
//        else
//        {
//          port = 993L;
//        }
//      }
//      else
//      {
//        if(secure == false)
//        {
//          port = 110L;
//        }
//        else
//        {
//          port = 995L;
//        }
//      }
//    }
    
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
    
    Boolean proven = authenticateMail(id, challengeProof.string());
    
    Map<String, Object> res = new HashMap<String, Object>();
    res.put("authenticated", proven);
    Obj expiration = new Obj(new HashMap<String, Object>());
    expiration.set("expired", false);
    res.put("expiration", expiration.map());
    
    return new Obj(res);
  }
  
  public Boolean authenticateMail(String username, String password) throws Exception
  {
    Properties properties = new Properties();
    properties.put("mail." + protocol + ".host", server);
    if(port != null)
    {
      properties.put("mail." + protocol + ".port", port);
    }
    if(secure != null)
    {
      properties.put("mail." + protocol + ".starttls.enable", secure);
    }
    
    Session emailSession = Session.getDefaultInstance(properties);
//    Session emailSession = Session.getDefaultInstance(properties, new javax.mail.Authenticator()
//    {
//      protected PasswordAuthentication getPasswordAuthentication()
//      {
//        return new PasswordAuthentication(username, password);
//      }
//    });
    
    Store store = emailSession.getStore(protocol);
    store.connect(username, password);
    Folder folderInbox = store.getFolder("INBOX");
    folderInbox.open(Folder.READ_ONLY);
    boolean isAuthenticated = folderInbox.isOpen() && username.equals(folderInbox.getURLName().getUsername());
m.Global.log.debug(properties, isAuthenticated, folderInbox.getMessageCount(), folderInbox.getNewMessageCount(), folderInbox.getURLName());
    folderInbox.close();
    store.close();
    
    m.Global.log.debug(properties, isAuthenticated);
    
    return isAuthenticated;
//    return true;
  }
  
  public ObjInput credentialExpiryCheck(String id) throws Exception
  {
    return null;
//    throw new Exception();
  }
  
  public ObjInput credentialRenewal(String id, ObjInput challengeProof, ObjInput credentialNew, int renewalDays) throws Exception
  {
    return null;
//    throw new Exception();
  }
  
  public ObjInput credentialReset(String id, ObjInput credentialNew, int renewalDays) throws Exception
  {
    return null;
//    throw new Exception();
  }
  
  public void add(String id, ObjInput credential) throws Exception
  {
//    throw new Exception();
  }
  
  public void remove(String id) throws Exception
  {
//    throw new Exception();
  }
}
