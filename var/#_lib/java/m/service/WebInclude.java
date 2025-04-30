package m.service;

import m.object.*;
import m.conf.*;
import m.auth.*;

public class WebInclude implements AuthorizedService, ConfigurableObject
{
  protected String url;
  protected boolean append;
  
  public void configure(Obj params) throws Exception
  {
    url = params.string(Conf.URL);
    if(url.startsWith("/"))
    {
      url = url.substring(1);
    }
    
    Boolean appendObject = params.bool(Conf.APPEND);
    append = appendObject == null ? false : appendObject;
  }
  
  public void execute(AuthorizatorSession session, String command, ObjInput in, ObjOutput out) throws Exception
//  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    String includeURL = url == null ? "" : url;
    
    if(append == true && command != null && !"".equals(command))
    {
//      includeURL += "/" + command;
      includeURL += command;
    }
    
    m.Global.log.debug(command, url, append, includeURL);
    
    session.execute(includeURL, in, out);
  }
}
