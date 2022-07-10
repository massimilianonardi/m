package m.auth;

import java.util.*;

import javax.net.ssl.*;

import javax.naming.*;
import javax.naming.directory.*;
import static javax.naming.directory.SearchControls.SUBTREE_SCOPE;
import javax.naming.ldap.*;
//import javax.security.auth.login.*;

public class ActiveDirectory
{
  private static final String CONTEXT_FACTORY_CLASS = "com.sun.jndi.ldap.LdapCtxFactory";
  
  public static String[] nsLookup(String argDomain) throws Exception
  {
    Hashtable<Object, Object> params = new Hashtable<Object, Object>();
    params.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.dns.DnsContextFactory");
    params.put("java.naming.provider.url", "dns:");
    DirContext ctx = new InitialDirContext(params);
    Attributes attributes = ctx.getAttributes(String.format("_ldap._tcp.%s", argDomain), new String[] { "srv" });
    // try thrice to get the KDC servers before throwing error
    for(int i = 0; i < 3; i++)
    {
      Attribute a = attributes.get("srv");
      if(a != null)
      {
        List<String> domainServers = new ArrayList<String>();
        NamingEnumeration<?> enumeration = a.getAll();
        while(enumeration.hasMoreElements())
        {
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
    
    throw new Exception();
  }
  
  public static LdapContext getContext(String username, String password, String domainName) throws Exception
  {
    String ldapServerUrls[] = nsLookup(domainName);
    for(int i = 0; i < ldapServerUrls.length; i++)
    {
      Hashtable<Object, Object> params = new Hashtable<Object, Object>();
      params.put(Context.INITIAL_CONTEXT_FACTORY, CONTEXT_FACTORY_CLASS);
      params.put(Context.PROVIDER_URL, ldapServerUrls[i]);
      params.put(Context.SECURITY_PRINCIPAL, username + "@" + domainName);
      params.put(Context.SECURITY_CREDENTIALS, password);
//      DirContext context = new InitialDirContext(params);
      LdapContext context = new InitialLdapContext(params, null);
      
      return context;
    }
    
    return null;
  }
  
  public static User[] _getUsers(LdapContext context) throws Exception
  {
 String domainName = "rpr.local";
    System.out.println("m.auth.ActiveDirectory._getUsers() " + ((String) context.getEnvironment().get(Context.SECURITY_PRINCIPAL)));
        java.util.ArrayList<User> users = new java.util.ArrayList<User>();
//        String authenticatedUser = (String) context.getEnvironment().get(Context.SECURITY_PRINCIPAL);
//        if (authenticatedUser.contains("@")){
//            String domainName = authenticatedUser.substring(authenticatedUser.indexOf("@")+1);
            SearchControls controls = new SearchControls();
            controls.setSearchScope(SUBTREE_SCOPE);
            controls.setReturningAttributes(userAttributes);
            NamingEnumeration answer = context.search( toDC(domainName), "(objectClass=user)", controls);
            try{
                while(answer.hasMore()) {
                    Attributes attr = ((SearchResult) answer.next()).getAttributes();
                    Attribute user = attr.get("userPrincipalName");
                    if (user!=null){
                        users.add(new User(attr));
                    }
                }
            }
            catch(Exception e){}
//        }
        return users.toArray(new User[users.size()]);
    }
  
  
  
  
  
  public static class User
  {
    private String distinguishedName;
    private String userPrincipal;
    private String commonName;
    
    public User(Attributes attr) throws javax.naming.NamingException
    {
      userPrincipal = (String) attr.get("userPrincipalName").get();
      commonName = (String) attr.get("cn").get();
      distinguishedName = (String) attr.get("distinguishedName").get();
    }
    
    public String getUserPrincipal()
    {
      return userPrincipal;
    }
    
    public String getCommonName()
    {
      return commonName;
    }
    
    public String getDistinguishedName()
    {
      return distinguishedName;
    }
    
    public String toString()
    {
      return getDistinguishedName();
    }
    
    public void changePassword(String oldPass, String newPass, boolean trustAllCerts, LdapContext context) throws java.io.IOException, NamingException
    {
      String dn = getDistinguishedName();
      
      StartTlsResponse tls = null;
      try
      {
        tls = (StartTlsResponse) context.extendedOperation(new StartTlsRequest());
      }
      catch(Exception e)
      {
        //"Problem creating object: javax.naming.ServiceUnavailableException: [LDAP: error code 52 - 00000000: LdapErr: DSID-0C090E09, comment: Error initializing SSL/TLS, data 0, v1db0"
        throw new java.io.IOException("Failed to establish SSL connection to the Domain Controller. Is LDAPS enabled?");
      }
      
      if(trustAllCerts)
      {
        tls.setHostnameVerifier(DO_NOT_VERIFY);
        SSLSocketFactory sf = null;
        try
        {
          SSLContext sc = SSLContext.getInstance("TLS");
          sc.init(null, TRUST_ALL_CERTS, null);
          sf = sc.getSocketFactory();
        }
        catch(java.security.NoSuchAlgorithmException e)
        {
        }
        catch(java.security.KeyManagementException e)
        {
        }
        tls.negotiate(sf);
      }
      else
      {
        tls.negotiate();
      }
      
      try
      {
        //ModificationItem[] modificationItems = new ModificationItem[1];
        //modificationItems[0] = new ModificationItem(DirContext.REPLACE_ATTRIBUTE, new BasicAttribute("unicodePwd", getPassword(newPass)));
        
        ModificationItem[] modificationItems = new ModificationItem[2];
        modificationItems[0] = new ModificationItem(DirContext.REMOVE_ATTRIBUTE, new BasicAttribute("unicodePwd", getPassword(oldPass)) );
        modificationItems[1] = new ModificationItem(DirContext.ADD_ATTRIBUTE, new BasicAttribute("unicodePwd", getPassword(newPass)) );
        context.modifyAttributes(dn, modificationItems);
      }
      catch(javax.naming.directory.InvalidAttributeValueException e)
      {
        String error = e.getMessage().trim();
        if(error.startsWith("[") && error.endsWith("]"))
        {
          error = error.substring(1, error.length() - 1);
        }
        System.err.println(error);
//        e.printStackTrace();
        tls.close();
        throw new NamingException("New password does not meet Active Directory requirements. Please ensure that the new password meets password complexity, length, minimum password age, and password history requirements.");
      }
      catch(NamingException e)
      {
        tls.close();
        throw e;
      }
      
      tls.close();
    }
    
    private static final HostnameVerifier DO_NOT_VERIFY = new HostnameVerifier()
    {
      public boolean verify(String hostname, SSLSession session)
      {
        return true;
      }
    };
    
    private static TrustManager[] TRUST_ALL_CERTS = new TrustManager[]
    {
      new X509TrustManager()
      {
        public java.security.cert.X509Certificate[] getAcceptedIssuers()
        {
          return null;
        }
        
        public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType)
        {
        }
        
        public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType)
        {
        }
      }
    };
    
    private byte[] getPassword(String newPass)
    {
      String quotedPassword = "\"" + newPass + "\"";
//      return quotedPassword.getBytes("UTF-16LE");
      char unicodePwd[] = quotedPassword.toCharArray();
      byte pwdArray[] = new byte[unicodePwd.length * 2];
      for (int i=0; i<unicodePwd.length; i++)
      {
        pwdArray[i*2 + 1] = (byte) (unicodePwd[i] >>> 8);
        pwdArray[i*2 + 0] = (byte) (unicodePwd[i] & 0xff);
      }
      
      return pwdArray;
    }
  }
  
  private static String[] userAttributes = {"distinguishedName", "cn", "name", "uid", "sn", "givenname", "memberOf", "samaccountname", "userPrincipalName"};
  
  private ActiveDirectory(){};
  
  public static LdapContext getConnection(String username, String password) throws NamingException
  {
    return getConnection(username, password, null, null);
  }
  
  public static LdapContext getConnection(String username, String password, String domainName) throws NamingException
  {
    return getConnection(username, password, domainName, null);
  }
  
  public static LdapContext getConnection(String username, String password, String domainName, String serverName) throws NamingException
  {
    if(domainName == null)
    {
      try
      {
        String fqdn = java.net.InetAddress.getLocalHost().getCanonicalHostName();
        if(1 < fqdn.split("\\.").length)
        {
          domainName = fqdn.substring(fqdn.indexOf(".") + 1);
        }
      }
      catch(java.net.UnknownHostException e)
      {
      }
    }
    
System.out.println("Authenticating " + username + "@" + domainName + " through " + serverName);
    
    if(password != null)
    {
      password = password.trim();
      if(password.length() == 0)
      {
        password = null;
      }
    }
    
    Hashtable props = new Hashtable();
    String principalName = username + "@" + domainName;
    props.put(Context.SECURITY_PRINCIPAL, principalName);
    if(password != null)
    {
      props.put(Context.SECURITY_CREDENTIALS, password);
    }
    
    String ldapURL = "ldap://" + ((serverName==null)? domainName : serverName + "." + domainName) + '/';
    props.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
    props.put(Context.PROVIDER_URL, ldapURL);
    try
    {
      return new InitialLdapContext(props, null);
    }
    catch(Exception e)
    {
      e.printStackTrace();
      throw e;
    }
//    catch(javax.naming.CommunicationException e)
//    {
//      throw new NamingException("Failed to connect to " + domainName + ((serverName==null)? "" : " through " + serverName));
//    }
//    catch(NamingException e)
//    {
//      throw new NamingException("Failed to authenticate " + username + "@" + domainName + ((serverName==null)? "" : " through " + serverName));
//    }
  }
  
  public static User getUser(String username, LdapContext context)
  {
    try
    {
      String domainName = null;
      if(username.contains("@"))
      {
        username = username.substring(0, username.indexOf("@"));
        domainName = username.substring(username.indexOf("@") + 1);
      }
      else if(username.contains("\\"))
      {
        username = username.substring(0, username.indexOf("\\"));
        domainName = username.substring(username.indexOf("\\") + 1);
      }
      else
      {
        String authenticatedUser = (String) context.getEnvironment().get(Context.SECURITY_PRINCIPAL);
        if(authenticatedUser.contains("@"))
        {
          domainName = authenticatedUser.substring(authenticatedUser.indexOf("@") + 1);
        }
      }
      
      if(domainName != null)
      {
        String principalName = username + "@" + domainName;
        SearchControls controls = new SearchControls();
        controls.setSearchScope(SUBTREE_SCOPE);
        controls.setReturningAttributes(userAttributes);
        NamingEnumeration<SearchResult> answer = context.search(toDC(domainName), "(& (userPrincipalName=" + principalName + ")(objectClass=user))", controls);
        if(answer.hasMore())
        {
          Attributes attr = answer.next().getAttributes();
          Attribute user = attr.get("userPrincipalName");
NamingEnumeration e = attr.getAll();
while(e.hasMore())
{
  Object o = e.next();
  System.out.println("m.auth.ActiveDirectory.getUser()" + o.toString());
}
          if(user != null)
          {
            return new User(attr);
          }
        }
      }
    }
    catch(NamingException e)
    {
//      e.printStackTrace();
    }
    return null;
  }
  
  public static User[] getUsers(LdapContext context) throws NamingException
  {
 
        java.util.ArrayList<User> users = new java.util.ArrayList<User>();
        String authenticatedUser = (String) context.getEnvironment().get(Context.SECURITY_PRINCIPAL);
        if (authenticatedUser.contains("@")){
            String domainName = authenticatedUser.substring(authenticatedUser.indexOf("@")+1);
            SearchControls controls = new SearchControls();
            controls.setSearchScope(SUBTREE_SCOPE);
            controls.setReturningAttributes(userAttributes);
            NamingEnumeration answer = context.search( toDC(domainName), "(objectClass=user)", controls);
            try{
                while(answer.hasMore()) {
                    Attributes attr = ((SearchResult) answer.next()).getAttributes();
                    Attribute user = attr.get("userPrincipalName");
                    if (user!=null){
                        users.add(new User(attr));
                    }
                }
            }
            catch(Exception e){}
        }
        return users.toArray(new User[users.size()]);
    }
  
 
 
    private static String toDC(String domainName)
    {
        StringBuilder buf = new StringBuilder();
        for (String token : domainName.split("\\.")) {
            if(token.length()==0)   continue;   // defensive check
            if(buf.length()>0)  buf.append(",");
            buf.append("DC=").append(token);
        }
        return buf.toString();
    }
}
