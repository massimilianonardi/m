package m.auth;

import java.util.*;

import javax.mail.*;

import m.object.*;
import m.conf.*;
import m.util.*;
import m.enc.*;

public class MailAuthenticator implements Authenticator, ConfigurableObject
{
  protected String server;
  protected Long port;
  protected String protocol;
  protected Boolean secure;
  
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
  }
  
  public Boolean authenticate(String id, ObjInput challengeProof) throws Exception
  {
    Boolean proof = false;
    
    try
    {
      proof = authenticateMail(id, challengeProof.string());
    }
    catch(Exception e)
    {
      e.printStackTrace();
      proof = false;
    }
    
    return proof;
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
  
  protected ObjInput getCredential(String id) throws Exception
  {
    throw new Exception();
  }
  
  protected String getExpiration(String id) throws Exception
  {
    return null;
  }
}
