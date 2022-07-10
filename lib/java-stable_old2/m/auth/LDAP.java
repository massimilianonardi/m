package m.auth;


import java.util.*;

import javax.net.ssl.*;

import javax.naming.*;
import javax.naming.directory.*;
import static javax.naming.directory.SearchControls.SUBTREE_SCOPE;
import javax.naming.ldap.*;
//import javax.security.auth.login.*;

import m.object.*;
import m.conf.*;
import m.enc.*;
import m.file.*;
import m.stream.*;
import m.service.*;
import m.util.*;

public class LDAP
{
  static final protected String CONTEXT_FACTORY_CLASS = "com.sun.jndi.ldap.LdapCtxFactory";
  static final protected String DNS_CONTEXT_FACTORY_CLASS = "com.sun.jndi.dns.DnsContextFactory";
  static final protected String PROVIDER_URL = "java.naming.provider.url";
  static final protected String PROVIDER_URL_DNS = "dns:";
  static final protected String PROVIDER_ATTRIBUTE_SRV = "srv";
  static final protected String PROVIDER_ATTRIBUTE_SAM_ACCOUNT_NAME = "sAMAccountName";
  
  static protected String[] userAttributesArray = {"distinguishedName", "cn", "name", "uid", "sn", "givenname", "memberOf", "samaccountname", "userPrincipalName"};
  
  static final protected HostnameVerifier HOSTNAME_VERIFIER_DO_NOT_VERIFY = new HostnameVerifier()
  {
    public boolean verify(String hostname, SSLSession session)
    {
      return true;
    }
  };
  
  static final protected TrustManager[] TRUST_MANAGER_TRUST_ALL_CERTS = new TrustManager[]
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
  
  static public String[] getDomainServers(String domain) throws Exception
  {
    Hashtable<Object, Object> params = new Hashtable<Object, Object>();
    params.put(Context.INITIAL_CONTEXT_FACTORY, DNS_CONTEXT_FACTORY_CLASS);
    params.put(PROVIDER_URL, PROVIDER_URL_DNS);
    DirContext dirContext = new InitialDirContext(params);
    Attributes attributes = dirContext.getAttributes(String.format("_ldap._tcp.%s", domain), new String[]{PROVIDER_ATTRIBUTE_SRV});
    Attribute srvAttribute = attributes.get(PROVIDER_ATTRIBUTE_SRV);
    if(srvAttribute == null)
    {
      throw new Exception();
    }
    List<String> domainServers = new ArrayList<String>();
    NamingEnumeration<?> enumeration = srvAttribute.getAll();
    while(enumeration.hasMoreElements())
    {
      String srvAttr = (String) enumeration.next();
      // 0: priority, 1: weight, 2: port, 3: server
      String values[] = srvAttr.split(" ");
      domainServers.add(String.format("ldap://%s:%s", values[3], values[2]));
    }
    String domainServersArray[] = new String[domainServers.size()];
    domainServers.toArray(domainServersArray);
    
    return domainServersArray;
  }
  
  static public LdapContext getLdapContext(String username, String password, String domainName) throws Exception
  {
    return getLdapContext(username, password, domainName, getDomainServers(domainName));
  }
  
  static public LdapContext getLdapContext(String username, String password, String domainName, String[] ldapServerUrls) throws Exception
  {
    for(int i = 0; i < ldapServerUrls.length; i++)
    {
      Hashtable<Object, Object> params = new Hashtable<Object, Object>();
      params.put(Context.INITIAL_CONTEXT_FACTORY, CONTEXT_FACTORY_CLASS);
      params.put(Context.PROVIDER_URL, ldapServerUrls[i]);
      params.put(Context.SECURITY_PRINCIPAL, username + "@" + domainName);
      params.put(Context.SECURITY_CREDENTIALS, password);
//      params.put(Context.REFERRAL, "ignore");
//      DirContext context = new InitialDirContext(params);
      LdapContext context = new InitialLdapContext(params, null);
      
      return context;
    }
    
    throw new Exception();
  }
  
  static public Map<String, String> getUserAttributes(String username, LdapContext context) throws Exception
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
    
    if(domainName == null)
    {
      throw new Exception();
    }
    
    String principalName = username + "@" + domainName;
    SearchControls controls = new SearchControls();
    controls.setSearchScope(SUBTREE_SCOPE);
    controls.setReturningAttributes(userAttributesArray);
    NamingEnumeration<SearchResult> answer = context.search(toDC(domainName), "(& (userPrincipalName=" + principalName + ")(objectClass=user))", controls);
    
    boolean hasMore = false;
    try
    {
      hasMore = answer.hasMore();
    }
    catch(Exception e)
    {
      hasMore = false;
//      e.printStackTrace();
    }
    
    if(hasMore == false)
    {
      throw new Exception();
    }
    
    Attributes attributes = answer.next().getAttributes();
    NamingEnumeration namingEnumeration = attributes.getIDs();
    Map<String, String> userAttributes = new HashMap<String, String>();
    while(namingEnumeration.hasMore())
    {
      String attributeName = (String) namingEnumeration.next();
      String attributeValue = (String) attributes.get(attributeName).get();
      userAttributes.put(attributeName, attributeValue);
    }
    
    return userAttributes;
  }
  
  static public Set<String> getUsers(LdapContext context) throws Exception
  {
    System.out.println("m.auth.LDAP.getUsers()" + getUsersAttributes(context).keySet().toString());
    return getUsersAttributes(context).keySet();
  }
  
  static public Map<String, Map<String, String>> getUsersAttributes(LdapContext context) throws Exception
  {
    String domainName = null;
    
    String authenticatedUser = (String) context.getEnvironment().get(Context.SECURITY_PRINCIPAL);
    if(authenticatedUser.contains("@"))
    {
      domainName = authenticatedUser.substring(authenticatedUser.indexOf("@") + 1);
    }
    else
    {
      throw new Exception();
    }
    
    SearchControls controls = new SearchControls();
    controls.setSearchScope(SUBTREE_SCOPE);
    controls.setReturningAttributes(userAttributesArray);
    NamingEnumeration<SearchResult> answer = context.search(toDC(domainName), "(objectClass=user)", controls);
    
    Map<String, Map<String, String>> usersAttributes = new HashMap<String, Map<String, String>>();
    boolean hasMore = false;
    try
    {
      hasMore = answer.hasMore();
    }
    catch(Exception e)
    {
      hasMore = false;
//      e.printStackTrace();
    }
    while(hasMore)
    {
      Attributes attributes = answer.next().getAttributes();
      NamingEnumeration namingEnumeration = attributes.getIDs();
      Map<String, String> userAttributes = new HashMap<String, String>();
      while(namingEnumeration.hasMore())
      {
        String attributeName = (String) namingEnumeration.next();
        String attributeValue = (String) attributes.get(attributeName).get();
        userAttributes.put(attributeName, attributeValue);
      }
      
      usersAttributes.put(userAttributes.get(PROVIDER_ATTRIBUTE_SAM_ACCOUNT_NAME), userAttributes);
      try
      {
        hasMore = answer.hasMore();
      }
      catch(Exception e)
      {
        hasMore = false;
//        e.printStackTrace();
      }
    }
    
    return usersAttributes;
  }
  
  static public void changePassword(String userDN, String oldPassword, String newPassword, boolean trustAllCerts, LdapContext context) throws Exception
  {
    StartTlsResponse tls = (StartTlsResponse) context.extendedOperation(new StartTlsRequest());
    
    if(trustAllCerts)
    {
      tls.setHostnameVerifier(HOSTNAME_VERIFIER_DO_NOT_VERIFY);
      SSLSocketFactory sf = null;
      try
      {
        SSLContext sc = SSLContext.getInstance("TLS");
        sc.init(null, TRUST_MANAGER_TRUST_ALL_CERTS, null);
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
      modificationItems[0] = new ModificationItem(DirContext.REMOVE_ATTRIBUTE, new BasicAttribute("unicodePwd", getPassword(oldPassword)) );
      modificationItems[1] = new ModificationItem(DirContext.ADD_ATTRIBUTE, new BasicAttribute("unicodePwd", getPassword(newPassword)) );
      context.modifyAttributes(userDN, modificationItems);
    }
    catch(Exception e)
    {
      tls.close();
      throw e;
    }
    
    tls.close();
  }
  
  static protected String toDC(String domainName)
  {
    StringBuilder buffer = new StringBuilder();
    
    for(String token: domainName.split("\\."))
    {
      if(token.length() == 0)
      {
        continue;
      }
      if(0 < buffer.length())
      {
        buffer.append(",");
      }
      buffer.append("DC=").append(token);
    }
    
    return buffer.toString();
  }
  
  static protected byte[] getPassword(String password)
  {
    String quotedPassword = "\"" + password + "\"";
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
