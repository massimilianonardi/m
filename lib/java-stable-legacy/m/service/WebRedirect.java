package m.service;

import javax.servlet.http.*;

import m.object.*;
import m.conf.*;
import m.auth.*;

public class WebRedirect implements AuthorizedService, ConfigurableObject
{
  protected String url;
  protected boolean append;
  
  public void configure(Obj params) throws Exception
  {
    url = params.string(Conf.URL);
    Boolean appendObject = params.bool(Conf.APPEND);
    append = appendObject == null ? false : appendObject;
  }
  
  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    HttpServletResponse response = ((m.web.WebObjOutput) out).getHttpServletResponse();
    
    String redirectURL = url;
    
    if(append)
    {
      redirectURL += "/" + command;
    }
    
    m.Global.log.debug(command, url, append, redirectURL);
    
    response.sendRedirect(redirectURL);
  }
}
