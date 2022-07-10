package m.auth;

import java.io.*;
import java.util.*;

import m.object.*;
import m.conf.*;
import m.util.*;
import m.file.*;
import m.stream.*;

public class FSBaseAuthorizationSessionProfiler extends BaseAuthorizationSessionProfiler<FileSystem> implements AuthorizationSession.Profiler
{
  protected Obj loadRules() throws Exception
  {
    Obj rules = new Obj();
    rules.streamFromInput(get().stream("rules.json"));
    
    return rules;
  }
  
  // todo load/merge also from individual files where file-path=profile-path-trigger
  protected Obj loadTriggers() throws Exception
  {
    Obj rules = new Obj();
    rules.streamFromInput(get().stream("triggers.json"));
    
    return rules;
  }
  
  protected String loadMappingName(String key) throws Exception
  {
    if(!get().isLink(key))
    {
      return null;
    }
    
    String name;
    
    name = get().link(key);
    name = name.split("../profiles/")[1];
    
    m.Global.log.debug(key, name);
    
    return name;
  }
  
  protected String loadRuleMapping(String key, String value, String profile, Obj rule) throws Exception
  {
    Obj geolocation = rule.get("geolocation");
    if(geolocation != null && "network/public-network".equals(profile))
    {
      return ipGeoLocation(value);
    }
    
    return null;
  }
  
  protected void loadTrigger(String key, String value, Obj trigger) throws Exception
  {
    Obj geolocation = trigger.get("geolocation");
    if(geolocation != null)
    {
      profileChangeAdd("network/" + ipGeoLocation(value));
    }
  }
  
  protected String ipGeoLocation(String ipString) throws Exception
  {
    return IPAddress.ipGeoLocation(ipString, get().root() + "/ip-geolocation.csv");
  }
  
  protected Map<String, Boolean> loadProfile(String key) throws Exception
  {
    if(!get().isFile(key + "/profile"))
    {
      return null;
    }
    
    Map<String, Boolean> profile;
    
    StreamSeekable stream = get().stream(key + "/profile");
    Obj profileObj = new Obj();
    profileObj.streamFromInput(stream);
    profile = profileObj.map();
    
    m.Global.log.debug(key, profile);
    
    return profile;
  }
  
  protected Obj loadConf(String key) throws Exception
  {
    if(!get().isFile(key + "/conf"))
    {
      return null;
    }
    
    StreamSeekable stream = get().stream(key + "/conf");
    Obj profileObj = new Obj();
    profileObj.streamFromInput(stream);
    
    return profileObj;
  }
}
