package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.util.*;

// todo fix unauthentication problem: if trigger on authtetication a session/authenticated with many possible authentications, 
// need a way to trigger when any authentication/* has removed -> temporarily define at least a trigger to remove session/authenticated

// todo triggers and rules should never throw exceptions to avoid security breach by interrupting loading of more restrictive profiles
// todo profiler ability to trigger global listeners (maybe just add proper session listeners???) eg for keep counter outside session
// global counters associated to ip or user to monitor hammering or to bill service usage
// profiler static variables and trigger extensions to achieve global counters and triggers
// check for already active sessions by recording the session-id, counters, etc.
// define glbal profiles important features that need to be accomplished:
// When does a user session end? -> 
// After 30 minutes of browser inactivity
// After 60 minutes (irrespective of browser activity)
// When the user closes their browser
// Once the limit of 200 user actions per session is reached
// By calling the JavaScript API function dtrum.endSession()
// 
// todo rules and triggers as prefix maps for prefix match
// todo check if may exists unseen conditions that can cause unwanted infinite trigger recursion

abstract public class Z_BaseAuthorizationSessionProfiler<T> extends ConfigurableWrapper<T> implements Z_AuthorizationSession.Profiler
{
  static final int CMD_ADD = 1;
  static final int CMD_REM = -1;
  
  static protected PrefixMap<Object> globalProfiles = new PrefixMap<Object>();
  
  protected PrefixSet profiles = new PrefixSet();
  protected List<String> profileStack = new ArrayList<String>();
  protected Map<String, Timer> profileTasks = new LinkedHashMap<String, Timer>();
  
  protected PrefixMap<Boolean> authorizations = new PrefixMap();
  protected Obj configuration = new Obj();
  
  protected Map<String, Map<String, Boolean>> authorizationProfiles = new LinkedHashMap<String, Map<String, Boolean>>();
  protected Map<String, Obj> configurationProfiles = new LinkedHashMap<String, Obj>();
  
  protected Obj rules;
  protected Obj triggers;
  
  protected boolean changed = false;
  protected boolean changedAuthorizations = false;
  protected boolean changedConfigurations = false;
  
  public void configure(Obj params) throws Exception
  {
    super.configure(params);
    
    rules = params.get(Conf.RULES);
    triggers = params.get(Conf.TRIGGERS);
    
    if(rules == null) rules = loadRules();
    if(triggers == null) triggers = loadTriggers();
    
    m.Global.log.debug(rules.object(), triggers.object());
  }
  
  public void sessionCreated() throws Exception
  {
    m.Global.log.debug();
    
    profileChange(null, "session", "anonymous", CMD_ADD);
  }
  
  public void sessionDestroyed() throws Exception
  {
    m.Global.log.debug();
    
    List<String> _profileStack = new ArrayList<String>();
    _profileStack.addAll(profileStack);
    for(String profile: _profileStack)
    {
      profileChangeRem(profile);
    }
    updateProfiles();
    
    profileStack.clear();
    profiles.clear();
    
    authorizations.clear();
    configuration.set("");
    
    authorizationProfiles.clear();
    configurationProfiles.clear();
  }
  
  public void sessionChallenged(String authentication, String id) throws Exception
  {
    profileChange("authentication-challenge", authentication, id, CMD_ADD);
  }
  
  public void sessionUnchallenged(String authentication, String id) throws Exception
  {
    profileChange("authentication-challenge", authentication, id, CMD_REM);
  }
  
  public void sessionAuthenticationExpired(String authentication, String id) throws Exception
  {
    profileChange("authentication-expired", authentication, id, CMD_ADD);
  }
  
  public void sessionAuthenticated(String authentication, String id) throws Exception
  {
    profileChange("authentication", authentication, id, CMD_ADD);
  }
  
  public void sessionUnauthenticated(String authentication, String id) throws Exception
  {
    profileChange("authentication", authentication, id, CMD_REM);
  }
  
  synchronized public void sessionAttributeChanged(String attribute, String previousValue, String value) throws Exception
  {
    if(previousValue != null)
    {
      profileChange("attribute", attribute, previousValue, CMD_REM);
    }
    
    if(value != null)
    {
      profileChange("attribute", attribute, value, CMD_ADD);
    }
  }
  
  public PrefixSet profiles() throws Exception
  {
    return profiles;
  }
  
  public List<String> profileStack() throws Exception
  {
    return profileStack;
  }
  
  public PrefixMap<Boolean> authorization() throws Exception
  {
    return authorizations;
  }
  
  public Map<String, Map<String, Boolean>> authorizations() throws Exception
  {
    return authorizationProfiles;
  }
  
  public Map<String, Boolean> authorization(String key) throws Exception
  {
    return authorizationProfiles.get(key);
  }
  
  public Obj configuration() throws Exception
  {
    return configuration;
  }
  
  public Map<String, Obj> configurations() throws Exception
  {
    return configurationProfiles;
  }
  
  public Obj configuration(String key) throws Exception
  {
    return configurationProfiles.get(key);
  }
  
  synchronized protected void profileChange(String type, String attribute, String value, int cmd) throws Exception
  {
    String key = type == null ? attribute : type + "/" + attribute;
    
    String profile = key + "/" + value;
    if(profiles.contains(profile) && cmd == CMD_ADD)
    {
      return;
    }
    else if(!profiles.contains(profile) && cmd == CMD_REM)
    {
      return;
    }
    
    String profileDirectlyMapped = loadMappingName(profile);
    String profileRuleMapped = checkRule(key, value);
    String profileRuleDirectlyMapped = loadMappingName(profileRuleMapped);
    
    m.Global.log.debug(profile, profileDirectlyMapped, profileRuleMapped, profileRuleDirectlyMapped);
    
    profileChange(profileRuleDirectlyMapped, cmd);
    profileChange(profileRuleMapped, cmd);
    profileChange(profileDirectlyMapped, cmd);
    profileChange(profile, cmd);
    checkTrigger(key, value, cmd);
    
    updateProfiles();
  }
  
  protected void profileChange(String profile, int cmd) throws Exception
  {
    switch(cmd)
    {
      case CMD_ADD: profileChangeAdd(profile); break;
      case CMD_REM: profileChangeRem(profile); break;
      default: throw new Exception();
    }
  }
  
  protected void profileChangeAdd(String profile) throws Exception
  {
    if(profile != null)
    {
      if(profiles.contains(profile))
      {
        return;
      }
      
      changed = true;
      
      profiles.add(profile);
      profileStack.add(profile);
      
      Map<String, Boolean> authorizationProfile = loadProfile(profile);
      if(authorizationProfile != null)
      {
        changedAuthorizations = true;
        authorizationProfiles.put(profile, authorizationProfile);
      }
      
      Obj configurationProfile = loadConf(profile);
      if(configurationProfile != null)
      {
        changedConfigurations = true;
        configurationProfiles.put(profile, configurationProfile);
      }
      
      checkTrigger(profile, null, CMD_ADD);
    }
  }
  
  protected void profileChangeRem(String profile) throws Exception
  {
    if(profile != null)
    {
      if(!profiles.contains(profile))
      {
        return;
      }
      
      changed = true;
      
      profiles.remove(profile);
      profileStack.removeAll(Collections.singletonList(profile));
      
      if(authorizationProfiles.containsKey(profile))
      {
        changedAuthorizations = true;
        authorizationProfiles.remove(profile);
      }
      
      if(configurationProfiles.containsKey(profile))
      {
        changedConfigurations = true;
        configurationProfiles.remove(profile);
      }
      
      Timer timer = profileTasks.get(profile);
      if(timer != null)
      {
        timer.cancel();
        profileTasks.remove(profile);
        
        m.Global.log.debug(profile, profileTasks.keySet());
      }
      
      checkTrigger(profile, null, CMD_REM);
    }
  }
  
  protected void updateProfiles() throws Exception
  {
    if(changed == false)
    {
      return;
    }
    
    updateAuthorizations();
    updateConfigurations();
    
    changed = false;
    
    m.Global.log.debug(profileStack, profiles.toArray(), authorizationProfiles.keySet(), configurationProfiles.keySet(), authorizations, configuration.object());
  }
  
  protected void updateAuthorizations() throws Exception
  {
    if(changedAuthorizations == false)
    {
      return;
    }
    
    authorizations = new PrefixMap();
    
    for(String profile: profileStack)
    {
      mergeAuthorizations(authorizationProfiles.get(profile));
    }
    
    changedAuthorizations = false;
  }
  
  protected void mergeAuthorizations(Map<String, Boolean> profile) throws Exception
  {
    if(profile == null)
    {
      return;
    }
    
    for(String key: profile.keySet())
    {
      Boolean policy = profile.get(key);
      
      authorizations.tailMap(key, true).headMap(key + Character.MAX_VALUE, true).clear();
      authorizations.put(key, policy);
    }
  }
  
  protected void updateConfigurations() throws Exception
  {
    if(changedConfigurations == false)
    {
      return;
    }
    
    configuration = new Obj();
    
    for(String profile: profileStack)
    {
      configuration.merge(configurationProfiles.get(profile));
    }
    
    changedConfigurations = false;
  }
  
  public void checkTrigger(String attribute, String value, int cmd) throws Exception
  {
    boolean add = cmd == CMD_ADD ? true : false;
    
    Obj trigger = triggers.get(attribute);
    if(trigger == null)
    {
      return;
    }
    
//    Boolean addFlag = trigger.bool("add");
//    if((addFlag == null && add == false) || (addFlag != null && add != addFlag))
    Boolean addFlag = trigger.bool("add/remove");
    if(addFlag != null && add != addFlag)
    {
      return;
    }
    
    String val = trigger.string("value");
    if(val != null && (value == null || (value != null && !value.startsWith(val))))
    {
      return;
    }
    
    if(val == null)
    {
      val = value;
    }
    
    Long valMax = trigger.integer("value.max");
    if(valMax != null && Long.parseLong(value) <= valMax)
    {
      return;
    }
    
    m.Global.log.debug(attribute, value, trigger);
    
    Long delay = trigger.integer("delay");
    if(delay == null)
    {
      trigger(attribute, value, trigger);
    }
    else
    {
      triggerDelayed(attribute, value, trigger, delay);
    }
  }
  
  protected void triggerDelayed(String attribute, String value, Obj trigger, Long delay) throws Exception
  {
    TimerTask task = new TimerTask()
    {
      @Override
      public void run()
      {
        try
        {
          trigger(attribute, value, trigger);
        }
        catch(Exception e)
        {
          e.printStackTrace();
        }
      }
    };
    
    Timer timer = new Timer();
    timer.schedule(task, delay);
    
    String key = value == null ? attribute : attribute + "/" + value;
    
    profileTasks.put(key, timer);
    
    m.Global.log.debug(key, profileTasks.keySet());
  }
  
  protected void trigger(String attribute, String value, Obj trigger) throws Exception
  {
    m.Global.log.debug(System.currentTimeMillis(), trigger.object());
    
    Boolean reset = trigger.bool("reset");
    List<String> keep = trigger.list("profiles.keep");
    List<String> toggle = trigger.list("profiles.toggle");
    List<String> add = trigger.list("profiles.add");
    List<String> rem = trigger.list("profiles.remove");
    if(reset != null && reset == true)
    {
      sessionDestroyed();
      sessionCreated();
    }
    else if(keep != null)
    {
//      List<String> _profileStack = profileStack;
//      sessionDestroyed();
//      for(String profile: _profileStack)
//      {
//        if(keep.contains(profile))
//        {
//          profileChangeAdd(profile);
//        }
//      }
      List<String> _profileStack = new ArrayList<String>();
      _profileStack.addAll(profileStack);
      for(String profile: _profileStack)
      {
        if(!keep.contains(profile))
        {
          profileChangeRem(profile);
        }
      }
    }
    else if(rem != null)
    {
      for(String profile: rem)
      {
        profileChangeRem(profile);
      }
    }
    
    if(toggle != null)
    {
      for(String profile: toggle)
      {
        if(profiles.contains(profile))
        {
          profileChangeRem(profile);
        }
        else
        {
          profileChangeAdd(profile);
        }
      }
    }
    
    if(add != null)
    {
      for(String profile: add)
      {
        profileChangeAdd(profile);
      }
    }
    
    try
    {
      loadTrigger(attribute, value, trigger);
    }
    catch(Exception e)
    {
      m.Global.log.debug(e.getMessage());
    }
    
    updateProfiles();
  }
  
  public String checkRule(String key, String value) throws Exception
  {
    String profile = value == null ? key : key + "/" + value;
    
    Obj rule = rules.get(key);
    if(rule == null)
    {
      return profile;
    }
    
    Obj regex = rule.get("regex");
    if(regex != null)
    {
      String expression = regex.string("expression");
      String replacement = regex.string("replace");
      profile = value == null ? key : key + "/" + value.replaceAll(expression, replacement);
    }
    
    Obj threshold = rule.get("threshold");
    if(threshold != null)
    {
      Long limit = threshold.integer("limit");
      if(limit != null && value != null)
      {
        String val = null;
        if(Long.parseLong(value) <= limit)
        {
          val = threshold.string("below");
        }
        else
        {
          val = threshold.string("above");
        }
        
        if(val != null)
        {
          profile = val;
        }
      }
    }
    
    Obj network = rule.get("network");
    if(network != null)
    {
      if(value == null)
      {
        throw new Exception();
      }
      else
      {
        profile = "network/" + IPAddress.ipClass(value);
      }
    }
    
    try
    {
      String ruleMapping = loadRuleMapping(key, value, profile, rule);
      if(ruleMapping != null)
      {
        profile = ruleMapping;
      }
    }
    catch(Exception e)
    {
      m.Global.log.debug(e.getMessage());
    }
    
    m.Global.log.debug(key + "/" + value, profile, rule);
    
    return profile;
  }
  
  abstract protected Obj loadRules() throws Exception;
  abstract protected Obj loadTriggers() throws Exception;
  abstract protected String loadMappingName(String key) throws Exception;
  abstract protected String loadRuleMapping(String key, String value, String profile, Obj rule) throws Exception;
  abstract protected void loadTrigger(String key, String value, Obj trigger) throws Exception;
  abstract protected Map<String, Boolean> loadProfile(String key) throws Exception;
  abstract protected Obj loadConf(String key) throws Exception;
}
