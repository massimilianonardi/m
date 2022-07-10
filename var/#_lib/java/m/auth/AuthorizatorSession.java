package m.auth;

import java.util.*;

import m.object.*;

public interface AuthorizatorSession
{
  public Authorizator authorizator() throws Exception;
  public String id() throws Exception;
  public List<String> profiles() throws Exception;
  
  public ObjInput challenge(String authentication, String id) throws Exception;
  public Boolean authenticate(String authentication, String id, ObjInput challengeProof) throws Exception;
  public Boolean unauthenticate(String authentication, String id) throws Exception;
  
  public boolean authorize(String request) throws Exception;
  public boolean execute(String command, ObjInput in, ObjOutput out) throws Exception;
  
//  public String getAttribute(String attribute) throws Exception;
//  public void setAttribute(String attribute, String value) throws Exception;
//  public void removeAttribute(String attribute) throws Exception;
//  public Map<String, String> attributes() throws Exception;
}
